import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    }
    try {
        const data = await zdk.ownerCount({
            where: {
                collectionAddresses: [tokenAddy],
                // attributes: 
            },
            networks: zdk.defaultNetworks
        })
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } catch (error) {
        console.error(error)
        return new Response("zdk.ownerCount failed", {status: 500})
    }
}