import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const data = zdk.defaultNetworks
    return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
}