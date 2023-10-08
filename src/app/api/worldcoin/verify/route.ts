import { NextRequest, NextResponse } from "next/server";

export type VerifyReply = {
  code: string;
  detail: string;
  nullifierHash: string;
};

const verifyEndpoint = `${process.env.NEXT_PUBLIC_WLD_API_BASE_URL}/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export async function POST(req: NextRequest) {
  console.log("Received request to verify credential:\n", req.body);
  let reqJson = await req.json();

  const reqBody = {
    nullifier_hash: reqJson.nullifier_hash,
    merkle_root: reqJson.merkle_root,
    proof: reqJson.proof,
    credential_type: reqJson.credential_type,
    action: reqJson.action,
    signal: reqJson.signal,
  };

  console.log("Sending request to World ID /verify endpoint:\n", reqBody);
  let verifyRes = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

  let wldResponse = await verifyRes.json();

  console.log(
    `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
    wldResponse
  );

  if (verifyRes.status == 200) {
    // This is where you should perform backend actions based on the verified credential, such as setting a user as "verified" in a database
    // For this example, we'll just return a 200 response and console.log the verified credential
    console.log(
      "Credential verified! This user's nullifier hash is: ",
      wldResponse.nullifier_hash
    );

    return NextResponse.json({
      code: "success",
      detail: "This action verified correctly!",
      nullifierHash: wldResponse.nullifier_hash,
    });
    //   resolve(void 0);
  } else {
    // This is where you should handle errors from the World ID /verify endpoint. Usually these errors are due to an invalid credential or a credential that has already been used.
    // For this example, we'll just return the error code and detail from the World ID /verify endpoint.
    return NextResponse.json({
      code: wldResponse.code,
      detail: wldResponse.detail,
    });
  }
  //   });
}
