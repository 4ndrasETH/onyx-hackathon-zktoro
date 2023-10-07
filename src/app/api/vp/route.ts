import { NextRequest, NextResponse } from "next/server";
import { delay } from "@/lib/utils";
export async function GET(request: NextRequest) {
  // call signVPTemporary
  // node signs the VP
  const signVPTemporaryRes = await fetch(
    "http://13.212.246.61/signVP_temporary"
  );
  console.log(signVPTemporaryRes);
  const signVPTemporaryText = await signVPTemporaryRes.text();
  console.log(signVPTemporaryText);
  
  // GET VP from node
  const retrieveVPRes = await fetch("http://13.212.246.61/retrieveVP");
  console.log(retrieveVPRes);
  const retrieveVPText = await retrieveVPRes.text();
  console.log("RetrievedVP")
  console.log(retrieveVPText);

  // verify VP

  return NextResponse.json({
    status: false,
  });
}
