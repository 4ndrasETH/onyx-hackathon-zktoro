import { ethrProvider } from "@/lib/config";
import { DIDWithKeys, EthrDIDMethod } from "@jpmorganchase/onyx-ssi-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: Replace this with an API call to the actual node or NodeManager
  const res = await request.json();
  const subjectDid: string = res.did;
  const didEthr = new EthrDIDMethod(ethrProvider);
  const issuerEthrDid: DIDWithKeys = await didEthr.create();
  return NextResponse.json({
    nodeDid: issuerEthrDid.did,
    subjectDid: subjectDid,
  });
}
