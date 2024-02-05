import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "@/app/AppConfig";
import { FrameSignaturePacket } from "@/fc/FrameSignaturePacket";
import { Frame200Response } from "@/fc/Frame200Response";
import { zdk } from "@/zora/zsk";
import { client } from "@/neynar/client";
import { FrameContent } from "@/fc/FrameContent";
import { SortDirection } from "@zoralabs/zdk";
import { OwnerCountSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";

// export const config = {
//   runtime: 'edge',
// }

async function HolderFrame(idx: number, collectionAddress: string) {
    const frameContent: FrameContent = {
        frameButtons: [],
        frameImageUrl: AppConfig.hostUrl,
        framePostUrl: AppConfig.hostUrl + `/api/holders?idx=${idx}&tokenAddy=${collectionAddress}`,
        frameTitle: "see Zora | Holders",
        frameVersion: 'vNext',
    }

    // Get mint transfers
    const res = await zdk.ownersByCount({
        where: {
            collectionAddresses: [collectionAddress],
        },
        pagination: {
            limit: 10
        },
        sort: {
            sortDirection: "DESC" as SortDirection,
            sortKey: "COUNT" as OwnerCountSortKey
        },

    })
    if (res.aggregateStat.ownersByCount.nodes.length == 0) {
        frameContent.frameButtons = [
            {
                action: 'push',
                label: '<Home>'
            }
        ]
        const msg = 'API error: No holder information found.'
        frameContent.frameImageUrl += `/api/image/error?tokenAddy=${collectionAddress}&msg=${msg}`
        return Frame200Response(frameContent)
    }
    // Set button names
    frameContent.frameButtons = res.aggregateStat.ownersByCount.nodes.length - 1 <= idx ?
        [
            {
                action: 'push',
                label: '<<Back'
            },
            {
                action: 'push',
                label: '<Home>'
            }
        ] 
        : 
        [
            {
                action: 'push',
                label: '<<Back'
            },
            {
                action: 'push',
                label: 'Next>>'
            },
            {
                action: 'push',
                label: 'Home'
            }
        ]
    const holder = res.aggregateStat.ownersByCount.nodes[idx]
    console.log(`holder: ${JSON.stringify(holder, null, 2)}`)
    const to = holder.owner
    const count = holder.count
    const rank = idx + 1

    frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}&to=${to}&count=${count}&rank=${rank}&date=${Date.now()}`

    try {
        // Example
        // vitalik.eth
        // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
        const user = await client.lookupUserByVerification(to);
        const username = user.result.user.username
        const pfp = user.result.user.pfp.url
        frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`
    } catch {
    }

    // TODO: Other interesting stats? Last purchase, last sale? how many minted? 
    return Frame200Response(frameContent)
}

// POST /api/latest-mints //
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const idx = +searchParams.get('idx')!
    const tokenAddy = searchParams.get('tokenAddy') as string
    const from = searchParams.get('from')
    const data: FrameSignaturePacket = await req.json()
    // Case 1: Called from /api/home
    // - show latest mint
    if (from == "home") {
        const res = await HolderFrame(0, tokenAddy)
        return res
    } else if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 2: Pressed Back button from page index 0
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 3: Pressed Back button from page index not 0
        return await HolderFrame(idx - 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        return await HolderFrame(idx + 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 3) {
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (data.untrustedData.buttonIndex == 4) {
        const collection = await zdk.collection({
            address: tokenAddy!,
            includeFullDetails: true
        })
        console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
        const networkName = collection.networkInfo.network!.toLowerCase()
        console.log(`networkName: ${networkName}`)
        return new NextResponse(null, {
            status: 302,
            headers: { Location: `https://zora.co/${networkName}:${tokenAddy}` },
          });
    }
    // Case 5: Pressed redirect to Zora button
    console.log(`FIXME: routing case not found`)
    return new Response()
}


export async function GET(req: NextRequest) {
    console.log('GET /api/mint')
    return new Response()
}