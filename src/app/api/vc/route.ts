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

export interface CreateVCTemplateRequestBody {
  worldcoin: string;
  issuer: string;
  subject: string;
}

export async function POST(request: NextRequest) {
  const res = await request.json();

  const worldcoin: string = res.worldcoin;
  const issuerDid: string = res.issuer;
  const subjectDid: string = res.subject;

  if (!issuerDid || !subjectDid || !worldcoin) {
    return NextResponse.json({
      error: "issuer, subject and worldcoin are required",
    });
  }

  const vcDidKey = (await new KeyDIDMethod().create()).did;
  const credentialType = "PROOF_OF_CONTROLLER";

  console.log(worldcoin);
  const subjectData = { controller: issuerDid, worldcoin };

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
  console.log("VC created:");
  console.log(vc);
  return NextResponse.json({
    vc,
  });
}
