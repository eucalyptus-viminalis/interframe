import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { SortDirection } from "@zoralabs/zdk";
import { OwnerCountSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    const limit = req.nextUrl.searchParams.get('limit')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    }
    try {
        const data = await zdk.ownersByCount({
            where: {
                collectionAddresses: [tokenAddy],
            },
            pagination: {
                limit: limit ? +limit : 10,
                // after: ""
            },
            sort: {
                sortDirection: "DESC" as SortDirection,
                sortKey: "COUNT" as OwnerCountSortKey   // COUNT | LATEST_MINT | NONE
            }
        })
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } catch (error) {
        console.error(error)
        return new Response("zdk.ownersByCount failed", {status: 500})
    }
}