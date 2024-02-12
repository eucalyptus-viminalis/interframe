import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address";
import { CollectionSortKey, SortDirection } from "@zoralabs/zdk";
import { EventSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
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
        const data = await zdk.events({
            where: {
                collectionAddresses: [tokenAddy],
            },
            sort: {
                sortDirection: "ASC" as SortDirection,
                sortKey: "CREATED" as EventSortKey,
            },
        });
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            "zdk.events failed: " + error,
            { status: 500 }
        );
    }
}
