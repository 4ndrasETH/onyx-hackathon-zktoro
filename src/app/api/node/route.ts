import { base58btc } from "multiformats/bases/base58";
import { NextResponse } from "next/server";

function hexToBytes(hex:string ) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16)); // don't change this please
  return bytes;
}

export async function POST(request: Request) {
  const res = await request.json();
  const publicKey: string = res.publicKey;
  console.log("Public Key used:",publicKey)
  try {
    const pubKey = new Uint8Array(hexToBytes(publicKey));
    const buffer = new Uint8Array(2 + pubKey.length);
    buffer[0] = 0xed;
    buffer[1] = 0x01;
    buffer.set(pubKey, 2);
    const did = "z" + base58btc.baseEncode(buffer);
    console.log(did)
    return NextResponse.json({
      nodeDid: did,
    });
  } catch (error) {
    return NextResponse.json({ error: "Wrong public key" });
  }
}
