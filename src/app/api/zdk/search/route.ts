import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { SearchableEntity } from "@zoralabs/zdk/dist/queries/queries-sdk";

export async function GET(req: NextRequest) {
    const limit = req.nextUrl.searchParams.get('limit')
    const query = req.nextUrl.searchParams.get('query')
    // Handle bad requests
    if (!query) {
        return new Response("Missing 'query' parameter", { status: 400 })
    }
    // } else if (!limit) {
    //     return new Response("Missing 'limit' parameter", { status: 400 })
    // } else if (isNaN(parseInt(limit)) && !isFinite(Number(limit))) {
    //     return new Response("Invalid 'limit' parameter. Must be a number.", { status: 400 })
    // }
    try {
        // FIXME: How do you use this???
        const data = await zdk.search({
            query: query,
            filter: {
                // collectionAddresses: ,
                // entityType: SearchableEntity.Collection,
                // entityType: SearchableEntity.Token
            },
            pagination: {
                limit: limit ? +limit : 10,
                // after:
            }
        })
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } catch (error) {
        console.error(error)
        return new Response(`zdk.search failed: ${error}`, {status: 500})
    }
}