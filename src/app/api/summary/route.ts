import { AppConfig } from "@/src/app/AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { zdk } from "@/src/zora/zsk";
import { NextRequest } from "next/server";

// Route segment config
// export const dynamic = 'force-dynamic'
// export const revalidate = '0'
// export const fetchCache = 'force-no-store'

// Data we want to display in the frame image
type SummaryImageParams = {
    ca: `0x${string}`;
    networkName: string | null | undefined;
    name: string | null | undefined;
    symbol: string | null | undefined;
    mintPrice?: number;
    totalSupply: number | null | undefined;
    description: string | null | undefined;
    totalMinted?: number | null | undefined;
};

// Function to convert TypeScript object to URLSearchParams
function objectToSearchParams(obj: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key]) {
                params.append(key, encodeURIComponent(obj[key].toString()));
            }
        }
    }
    return params;
}

// FRAME CONTENT //
const frameContent: FrameContent = {
    frameButtons: [],
    frameImageUrl: "",
    framePostUrl: AppConfig.hostUrl,
    frameTitle: "see Zora",
    frameVersion: "vNext",
};

// GET /api/summary
// Params:
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get(
        "tokenAddy"
    ) as `0x${string}`;

    // Try get collection details
    try {
        const collection = await zdk.collection({
            address: tokenAddy,
            includeFullDetails: false,
        });
        console.log(`zdk.collection: ${JSON.stringify(collection, null, 2)}`);

        // TODO: zdk.collectionStatsAggregate does not work with many collections
        // Get collection stats
        // const stats = await zdk.collectionStatsAggregate({
        //     collectionAddress: tokenAddy,
        //     network: collection.networkInfo,
        // })

        const summaryImageParams: SummaryImageParams = {
            ca: tokenAddy as `0x${string}`,
            description: collection.description,
            name: collection.name,
            symbol: collection.symbol,
            totalSupply: collection.totalSupply,
            networkName: collection.networkInfo.network,
            // TODO: Calculate mint price
            // mintPrice:
        };

        frameContent.frameImageUrl =
            AppConfig.hostUrl +
            "/api/image/summary?" +
            objectToSearchParams(summaryImageParams).toString();
        // Generate market link
        const zoraNetworkName =
            collection.networkInfo.network.toLowerCase() == "ethereum"
                ? "eth"
                : collection.networkInfo.network.toLowerCase();

        const marketLink = `https://zora.co/collect/${zoraNetworkName}:${tokenAddy}`;
        frameContent.frameButtons = [
            {
                action: "post",
                label: "🔴",
            },
            {
                action: "post",
                label: "🔵",
            },
            {
                action: "post",
                label: "🟣",
            },
            {
                action: "link",
                label: "🟢",
                target: marketLink,
            },
            // TODO: Add redirect button?
            // e.g. Link out to opensea/zora/warpcast page for token
            // {
            //     action: "post_redirect",
            //     label: "🟢"
            // }
        ];

        frameContent.framePostUrl =
            AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`;
        return Frame200Response(frameContent);
    } catch {
        // Collection not found
        const errorMsg = encodeURIComponent('Collection not found.')
        const backUrl = req.nextUrl.searchParams.get("backUrl") ?? ""
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&backUrl=${backUrl}`)
        return new Response(res.body, {headers:{'Content-Type':'text/html'}})
    }
}

// POST: /api/summary
// Params:
// tokenAddy
export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");

    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (data.untrustedData.buttonIndex == 1) {
        // Case 1: pressed "latest mints" button
        // - take user to latest mints page
        const response = await fetch(
            AppConfig.hostUrl + `/api/latest-mints?tokenAddy=${tokenAddy}`
        );
        return new Response(response.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 2: pressed "top holders" button
        // - take user to top holders page
        const response = await fetch(
            AppConfig.hostUrl + `/api/holders?&tokenAddy=${tokenAddy}`
        );
        return new Response(response.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 3: pressed "home" button
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 4) {
        // Case 4: pressed "🟢" button
        // External link; no need to handle with link button action type
    } else {
        // Case 5: Routing error
        const errorMsg = encodeURIComponent(
            "Bad route. Watch this cast to be notified of updates."
        );
        const res = await fetch(
            AppConfig.hostUrl +
                `/api/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
}

//   REFERENCE:
//   Making post request to url and error handling on response status
// const response = await fetch(AppConfig.hostUrl + `/api/latest-mints?from=home&tokenAddy=${tokenAddy}`, {
//     method: 'POST', // specify the method of your original request
//     headers: {
//         'Content-Type': 'application/json', // adjust headers if needed
//     },
//     body: JSON.stringify(data), // send the original request body
// });

// // Handle the response and return it
// if (response.ok) {
//     const responseData = response.body;
//     return new Response(responseData, {
//         status: response.status,
//         headers: {
//             'Content-Type': 'text/html',
//         },
//     });
// } else {
//     return new Response('Error handling the request', {
//         status: response.status,
//     });
// }
