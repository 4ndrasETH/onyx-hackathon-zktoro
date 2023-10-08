import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const res = await request.json();
  const signedVc: string = res.vc;
  console.log("Signed VC");
  console.log(signedVc);
  const issuerPublicKey: string = res.issuerPublicKey;
  const holderDid: string = res.holderDid;
  console.log("holderDID", res.holderDid);
  // const didResolver = new Resolver(
  //   getResolver({ rpcUrl: ethrProvider.rpcUrl, name: ethrProvider.name })
  // );
  try {
    // const isVCValid = await verifyCredentialJWT(signedVc, didResolver);
    // if (!isVCValid) {
    //   return NextResponse.json({ error: "VC validation failed" });
    // }

    // POST to node

    const putVCRes = await fetch("http://13.212.246.61/putVC", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issuer_public_key: issuerPublicKey,
        holder_did: holderDid,
        vc: signedVc,
      }),
    });

    const success = await putVCRes.text();
    if (success !== "Credential succesfully stored") {
      return NextResponse.json({ error: "VC upload failed" });
    }

    return NextResponse.json({ vc: signedVc });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "VC upload failed" });
  }
}
