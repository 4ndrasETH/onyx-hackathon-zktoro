import {
  KeyDIDMethod,
  SchemaManager,
  createCredential,
  verifyCredentialJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import path from "path";
import { ethrProvider } from "@/lib/config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const issuerDid = searchParams.get("issuer");
  const subjectDid = searchParams.get("subject");

  if (!issuerDid || !subjectDid) {
    return NextResponse.json({ error: "issuer and subject are required" });
  }

  const vcDidKey = (await new KeyDIDMethod().create()).did;
  const credentialType = "PROOF_OF_CONTROLLER";

  const subjectData = { controller: issuerDid };

  const additionalParams = {
    id: vcDidKey,
  };

  //Schema validation
  const proofOfNameSchema = await SchemaManager.getSchemaFromFile(
    path.resolve(
      path.join(process.cwd(), "schemas", `${camelCase(credentialType)}.json`)
    )
  );

  const validation: any = SchemaManager.validateCredentialSubject(
    subjectData,
    proofOfNameSchema
  );

  if (!validation) {
    return NextResponse.json({ error: "Schema validation failed" });
  }

  const vc = createCredential(
    issuerDid,
    subjectDid,
    subjectData,
    [credentialType],
    additionalParams
  );

  return NextResponse.json({
    vc,
  });
}

export async function POST(request: NextRequest) {
  const res = await request.json();
  const signedVc: string = res.vc;

  const didResolver = new Resolver(
    getResolver({ rpcUrl: ethrProvider.rpcUrl, name: ethrProvider.name })
  );
  try {
    const isVCValid = await verifyCredentialJWT(signedVc, didResolver);
    if (!isVCValid) {
      return NextResponse.json({ error: "VC validation failed" });
    }
    return NextResponse.json({ vc: signedVc });
  } catch (error) {
    return NextResponse.json({ error: "VC validation failed" });
  }
}
