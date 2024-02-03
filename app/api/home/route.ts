import { Frame200Response } from "@/fc/Frame200Response";
import { FrameContent } from "@/fc/FrameContent";
import { FrameSignaturePacket } from "@/fc/FrameSignaturePacket";
import { zdk } from "@/zora/zsk";
import { Chain, Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { NextRequest } from "next/server";

// ENV VARS //
const HOST_URL = process.env['HOST'] as string

// FRAME CONTENT //
const frameContent: FrameContent = {
    frameButtonNames: [""],
    frameImageUrl: "",
    framePostUrl: HOST_URL,
    frameTitle: "see Zora",
    frameVersion: "vNext"
}

// FUNCTIONS //

// Function to convert TypeScript object to URLSearchParams
function objectToSearchParams(obj: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            console.log(obj[key])
            if (obj[key]) {
                params.append(key, encodeURIComponent(obj[key].toString()));
            }
        }
    }
    return params;
}

export type TokenDetails = {
    ca: `0x${string}`
    networkName: "Zora"
    // networkId: 7777777
    name: string | null | undefined
    symbol: string | null | undefined
    mintStatus: "Minting" | "Fully allocated" | null | undefined
    mintPrice?: number | "Unknown"
    totalSupply: number | null | undefined
    description: string | null | undefined
    totalMinted: number | null | undefined
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy') as `0x${string}`
    // Get contract details
    const res = await zdk.collection({
        address: tokenAddy,
        includeFullDetails: false
    })
    console.log(`res: ${JSON.stringify(res, null, 2)}`)
    const { description, name, symbol, totalSupply, networkInfo } = res

    // Get aggregate stats
    const resres = await zdk.collectionStatsAggregate({
        collectionAddress: tokenAddy,
        network: {
            chain: Chain.ZoraMainnet,
            network: Network.Zora
        }
    })

    const nftCount = resres.aggregateStat.nftCount
    console.log(`totalSupply: ${totalSupply}`)
    console.log(`nftCount: ${nftCount}`)

    const mintStatus = !totalSupply
        ? undefined
        : totalSupply - nftCount == 0
            ? "Fully allocated" : "Minting"

    const tokenDetails: TokenDetails = {
        ca: tokenAddy as `0x${string}`,
        name: name,
        symbol: symbol,
        totalMinted: nftCount,
        mintStatus,
        networkName: networkInfo.network as string as "Zora",
        description,
        totalSupply: totalSupply,
    }

    const imgParams = objectToSearchParams(tokenDetails)
    console.log(imgParams.toString())

    frameContent.frameImageUrl = HOST_URL
        + "/api/image/title?" + imgParams.toString()
    frameContent.frameButtonNames = ["<Home>", "<Latest Mints>"]
    frameContent.framePostUrl = HOST_URL + `/api/home?tokenAddy=${tokenAddy}`
    return Frame200Response(frameContent)
}

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy')
    const data: FrameSignaturePacket = await req.json()
    // If buttonIndex == 2, take user to Latest Mint page
    const buttonIndex = data.untrustedData.buttonIndex
    if (buttonIndex === 2) {
        const response = await fetch(HOST_URL + `/api/latest-mints?from=home&tokenAddy=${tokenAddy}`, {
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
            return new Response()
        } else {
            return new Response('Error handling the request', {
                status: response.status,
            });
        }
    }


}