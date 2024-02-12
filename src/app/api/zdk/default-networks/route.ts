import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"

export async function GET(req: NextRequest) {
    const data = zdk.defaultNetworks
    return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
}