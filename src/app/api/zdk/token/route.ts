import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { Chain } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    const tokenId = req.nextUrl.searchParams.get('tokenId')
    const fullDetails = req.nextUrl.searchParams.get('fullDetails')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    } else if (!tokenId) {
        return new Response("Missing 'tokenId' parameter", { status: 400 })
    } else if (isNaN(parseInt(tokenId)) && !isFinite(Number(tokenId))) {
        return new Response("Invalid 'tokenId' parameter. Must be a number.", { status: 400 })
    }
    try {
        const collection = await zdk.collection({
            address: tokenAddy
        })
        const data = await zdk.token({
            token: {
                address: tokenAddy,
                tokenId: tokenId
            },
            includeFullDetails: fullDetails == 'true' ? true : false,
            network: collection.networkInfo,
            // networks: ZDKNetworkInfos,   // Does nothing??
        })
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } catch (error) {
        console.error(error)
        return new Response("zdk.token failed", {status: 500})
    }
}