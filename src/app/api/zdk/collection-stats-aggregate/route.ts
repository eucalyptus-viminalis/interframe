import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address";

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
        const collection = await zdk.collection({
            address: tokenAddy,
            includeFullDetails: false,
        });
        // Need to specify network info
        const data = await zdk.collectionStatsAggregate({
            collectionAddress: tokenAddy,
            network: collection.networkInfo,
        });
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            "zdk.collection or zdk.collectionStatsAggregate failed: " + error,
            { status: 500 }
        );
    }
}
