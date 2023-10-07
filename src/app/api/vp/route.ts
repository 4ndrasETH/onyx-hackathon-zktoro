import { ethrProvider } from "@/lib/config";
import {
  EthrDIDMethod,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyDIDs,
  verifyPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // call signVPTemporary
    // node signs the VP
    const signVPTemporaryRes = await fetch(
      "http://13.212.246.61/signVP_temporary",
      { cache: "no-store" }
    );
    await signVPTemporaryRes.text();

    // GET VP from node
    const retrieveVPRes = await fetch("http://13.212.246.61/retrieveVP", {
      cache: "no-store",
    });
    const vp = await retrieveVPRes.text();

    const didKey = new KeyDIDMethod();
    const didEthr = new EthrDIDMethod(ethrProvider);
    const didResolver = getSupportedResolvers([didKey, didEthr]);
    const isVpJwtValid = await verifyPresentationJWT(vp, didResolver);

    if (!isVpJwtValid) throw new Error("VP JWT is not valid");

    const vcJwt = getCredentialsFromVP(vp)[0];
    const vcVerified = await verifyDIDs(vcJwt, didResolver);

    return NextResponse.json({
      status: vcVerified,
    });
  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message,
    });
  }
}
