import { AppConfig } from "@/src/app/AppConfig";
import { Frame200Response } from "@/src/_fc/Frame200Response";
import { FrameContent } from "@/src/_fc/FrameContent";
import { FrameSignaturePacket } from "@/src/_fc/FrameSignaturePacket";
import { zdk } from "@/src/_zora/zsk";
import { NextRequest } from "next/server";

// Route segment config
// export const dynamic = 'force-dynamic'
// export const revalidate = '0'
// export const fetchCache = 'force-no-store'

// Data we want to display in the frame image
type SummaryImageParams = {
    ca: `0x${string}`
    networkName: string | null | undefined
    name: string | null | undefined
    symbol: string | null | undefined
    mintPrice?: number
    totalSupply: number | null | undefined
    description: string | null | undefined
    totalMinted: number | null | undefined
}

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
    frameVersion: "vNext"
}

// GET /api/home?tokenAddy=
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy') as `0x${string}`

    // Get collection details
    const collection = await zdk.collection({
        address: tokenAddy,
        includeFullDetails: false
    })

    // Get collection stats
    const stats = await zdk.collectionStatsAggregate({
        collectionAddress: tokenAddy,
        network: collection.networkInfo,
    })

    const summaryImageParams: SummaryImageParams = {
        ca: tokenAddy as `0x${string}`,
        description: collection.description,
        name: collection.name,
        symbol: collection.symbol,
        totalSupply: collection.totalSupply,
        networkName: collection.networkInfo.network,
        totalMinted: stats.aggregateStat.nftCount,
        // TODO: Calculate mint price
        // mintPrice:
    }

    frameContent.frameImageUrl = AppConfig.hostUrl
        + "/api/image/summary?" + objectToSearchParams(summaryImageParams).toString()
    frameContent.frameButtons = [
        {
            action: "post",
            label: "Home"
        },
        {
            action: "post",
            label: "Latest Mints"
        },
        {
            action: "post",
            label: "Holders"
        },
        // TODO: Add redirect button
        // {
        //     action: "post_redirect",
        //     label: "<See Zora>"
        // }
    ]

    frameContent.framePostUrl = AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`
    return Frame200Response(frameContent)
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')

    const data: FrameSignaturePacket = await req.json()

    // Route request
    if (data.untrustedData.buttonIndex == 1) {
        // Case 1: pressed "Home" button
        // - take user to home page
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 2: If pressed "Latest Mints" button
        const response = await fetch(AppConfig.hostUrl + `/api/latest-mints?from=home&tokenAddy=${tokenAddy}`, {
            method: 'POST', // specify the method of your original request
            headers: {
                'Content-Type': 'application/json', // adjust headers if needed
            },
            body: JSON.stringify(data), // send the original request body
        });

        // Handle the response and return it
        if (response.ok) {
            const responseData = response.body;
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        } else {
            return new Response('Error handling the request', {
                status: response.status,
            });
        }
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 3: If "Holders" button clicked
        const response = await fetch(AppConfig.hostUrl + `/api/holders?from=home&tokenAddy=${tokenAddy}`, {
            method: 'POST', // specify the method of your original request
            headers: {
                'Content-Type': 'application/json', // adjust headers if needed
            },
            body: JSON.stringify(data), // send the original request body
        });

        // Handle the response and return it
        if (response.ok) {
            console.log('RESPONSE OK!')
            const responseData = response.body;
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        } else {
            return new Response('Error handling the request', {
                status: response.status,
            });
        }
    } else if (data.untrustedData.buttonIndex == 4) {
        // Try input
        const input = data.untrustedData.inputText!
        if (!isValidEthereumAddress(input)) {
            frameContent.frameButtons = [
                {
                    action: 'push',
                    label: '<Home>'
                }
            ]
            const msg = 'Input error. Enter a valid Ethereum address'
            frameContent.frameImageUrl = AppConfig.hostUrl + `/api/image/error?tokenAddy=${tokenAddy}&msg=${msg}`
            frameContent.input = false
            return Frame200Response(frameContent)
        } else {
            return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${input}`)
        }
        
    }

}

function isValidEthereumAddress(address: string): boolean {
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  
    return ethereumAddressRegex.test(address);
  }
