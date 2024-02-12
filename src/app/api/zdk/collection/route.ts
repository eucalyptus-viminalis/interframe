import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    const fullDetails = req.nextUrl.searchParams.get('fullDetails')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    }
    const collection = await zdk.collection({
        address: req.nextUrl.searchParams.get('tokenAddy')!,
        includeFullDetails: fullDetails == 'true' ? true : false,
        // network: {}
    })
    return new Response(JSON.stringify(collection), {headers: {'Content-Type': 'application/json'}})
}