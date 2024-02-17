import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { Chain, SortDirection, TokenSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { ZDKNetworkInfos, zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    const limit = req.nextUrl.searchParams.get('limit')
    const fullDetails = req.nextUrl.searchParams.get('fullDetails')
    const salesHistory = req.nextUrl.searchParams.get('salesHistory')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    } else if (!limit) {
        return new Response("Missing 'limit' parameter", { status: 400 })
    } else if (isNaN(parseInt(limit)) && !isFinite(Number(limit))) {
        return new Response("Invalid 'limit' parameter. Must be a number.", { status: 400 })
    }
    try {
        const data = await zdk.tokens({
            where: {
                collectionAddresses: [tokenAddy],
                // ownerAddresses: ,
            },
            // filter: {
            //     attributeFilters,
            //     marketFilters,
            //     mediaType,
            //     priceFilter,
            //     timeFilter,
            // },
            pagination: {
                limit: limit ? +limit : 10,
                // after: ,
            },
            sort: {
                sortDirection: "ASC" as SortDirection,
                sortKey: "TIMED_SALE_ENDING" as TokenSortKey,    // CHAIN_TOKEN_PRICE | MINTED | NATIVE_PRICE | NONE | TIMED_SALE_ENDING | TOKEN_ID | TRANSFERRED
                // sortAxis,
            },
            includeFullDetails: fullDetails == 'true' ? true : false,
            includeSalesHistory: salesHistory == 'true' ? true : false,
            networks: ZDKNetworkInfos,
        })
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } catch (error) {
        console.error(error)
        return new Response(`zdk.tokens failed: ${error}`, {status: 500})
    }
}