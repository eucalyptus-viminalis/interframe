import { AppConfig } from "@/app/AppConfig";
import { Frame200Response } from "@/fc/Frame200Response";
import { FrameContent } from "@/fc/FrameContent";
import { FrameSignaturePacket } from "@/fc/FrameSignaturePacket";
import { zdk } from "@/zora/zsk";
import { Chain, Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { RedirectType, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = '0'
export const fetchCache = 'force-no-store'

// Data we want to display in the frame image
type ImageParams = {
    ca: `0x${string}`
    networkName: string | null | undefined
    name: string | null | undefined
    symbol: string | null | undefined
    mintStatus: "Minting" | "Fully allocated" | null | undefined
    mintPrice?: number | "Unknown"
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
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy') as `0x${string}`

    // Get collection details (zdk)
    const collection = await zdk.collection({
        address: tokenAddy,
        includeFullDetails: true
    })
    console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
    // Get collection stats (zdk)
    const stats = await zdk.collectionStatsAggregate({
        collectionAddress: tokenAddy,
        network: collection.networkInfo
    })
    console.log(`stats: ${JSON.stringify(stats, null, 2)}`)

    console.log(`totalSupply: ${collection.totalSupply}`)
    console.log(`nftCount: ${stats.aggregateStat.nftCount}`)

    // Calculate mint status
    const mintStatus = !collection.totalSupply
        ? undefined
        : collection.totalSupply - stats.aggregateStat.nftCount == 0
            ? "Fully allocated" : "Minting"

    const tokenDetails: ImageParams = {
        ca: tokenAddy as `0x${string}`,
        description: collection.description,
        name: collection.name,
        symbol: collection.symbol,
        totalSupply: collection.totalSupply,
        networkName: collection.networkInfo.network,
        totalMinted: stats.aggregateStat.nftCount,
        mintStatus,
    }

    const imgParams = objectToSearchParams(tokenDetails)
    console.log(`imgParams: ${imgParams}`)

    frameContent.frameImageUrl = AppConfig.hostUrl
        + "/api/image/title?" + imgParams.toString()
    frameContent.frameButtons = [
        {
            action: "post",
            label: "<Home>"
        },
        {
            action: "post",
            label: "<Latest Mints>"
        },
        {
            action: "post",
            label: "<Holders>"
        },
        {
            action: "post_redirect",
            label: "<See on Zora>"
        }
    ]
    frameContent.framePostUrl = AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`
    return Frame200Response(frameContent)
}

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy')
    const data: FrameSignaturePacket = await req.json()
    const buttonIndex = data.untrustedData.buttonIndex

    // Case 1: pressed "Home" button
    if (buttonIndex == 1) {
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (buttonIndex === 2) {
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
    } else if (buttonIndex == 3) {
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
    } else if (buttonIndex == 4) {
        // Do a redirect
        // Get collection details (zdk)
        const collection = await zdk.collection({
            address: tokenAddy!,
            includeFullDetails: true
        })
        console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
        const networkName = collection.networkInfo.network!.toLowerCase()
        console.log(`networkName: ${networkName}`)
        // Get collection stats (zdk)
        return redirect(`https://zora.co/collect/${networkName}`, RedirectType.push)
    }

}