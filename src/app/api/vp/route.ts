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
// export const fetchCache = 'force-no-store';
export const fetchCache = "force-no-store";
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();

    const vc = res.vc;
    const date = res.date;
    console.log(vc, date);

    // call signVPTemporary
    // node signs the VP
    const signVPTemporaryRes = await fetch(
      "http://13.212.246.61/signVP_temporary",
      { cache: "no-store" }
    );
    const signVPTemporaryText = await signVPTemporaryRes.text();

    // GET VP from node
    const retrieveVPRes = await fetch("http://13.212.246.61/retrieveVP", {
      cache: "no-store",
    });
    const vp = await retrieveVPRes.text();

    console.log(JSON.stringify(signVPTemporaryText));
    console.log(JSON.stringify(vp));

    const didKey = new KeyDIDMethod();
    const didEthr = new EthrDIDMethod(ethrProvider);
    const didResolver = getSupportedResolvers([didKey, didEthr]);
    try {
      const isVpJwtValid = await verifyPresentationJWT(vp, didResolver);
      console.log(isVpJwtValid);
      if (!isVpJwtValid) throw new Error("VP JWT is not valid");

      const vcJwt = getCredentialsFromVP(vp)[0];
      const vcVerified = await verifyDIDs(vcJwt, didResolver);

      return NextResponse.json({
        status: vcVerified,
        vp,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        error: (error as Error).message,
        signVPTemporaryText,
        vp,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: (error as Error).message,
    });
  }
}
