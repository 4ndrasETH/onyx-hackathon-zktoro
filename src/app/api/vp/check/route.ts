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

    const vp = res.vp;
    console.log("check vp", vp);

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
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: (error as Error).message,
    });
  }
}
