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
  worldIdResult: string;
  nullifierHash: string;
  issuer: string;
  subject: string;
}

export async function POST(request: NextRequest) {
  const res: CreateVCTemplateRequestBody = await request.json();

  const worldIdResult = res.worldIdResult;
  const nullifierHash = res.nullifierHash;
  const issuerDid = res.issuer;
  const subjectDid = res.subject;

  if (!issuerDid || !subjectDid || !worldIdResult || !nullifierHash) {
    return NextResponse.json({
      error: "issuer, subject, nullifierHash and worldIdResult are required",
    });
  }

  const vcDidKey = (await new KeyDIDMethod().create()).did;
  const credentialType = "PROOF_OF_CONTROLLER";

  const subjectData = {
    controller: issuerDid,
    world_id_result: worldIdResult,
    nullifier_hash: nullifierHash,
  };

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
