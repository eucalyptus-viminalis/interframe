import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address";
import { CollectionSortKey, SortDirection } from "@zoralabs/zdk";
import { MintSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { zdk } from "@/src/zdk/client";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const fullDetails = req.nextUrl.searchParams.get("fullDetails");
    const limit = req.nextUrl.searchParams.get("limit");
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 });
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response(
            "Invalid 'tokenAddy' parameter. Must be a 0x address.",
            { status: 400 }
        );
    }
    try {
        const data = await zdk.mints({
            where: {
                collectionAddresses: [tokenAddy],
            },
            includeFullDetails: fullDetails == 'true' ? true : false,
            sort: {
                sortDirection: "DESC" as SortDirection,
                sortKey: "TIME" as MintSortKey,  // PRICE | TIME | TOKEN_ID
            },
            // filter: ,
            // includeMarkets: ,
            // networks,
            pagination:  {
                limit: limit ? +limit : 50,
            }
        });
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            "zdk.mints failed: " + error,
            { status: 500 }
        );
    }
}
