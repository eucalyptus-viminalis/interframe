import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { zdk } from "@/src/zora/zsk";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
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
        const errorMsg = 'API error: No holder information found.'
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}tokenAddy=${collectionAddress}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
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

// GET: /api/holders
// Params:
// tokenAddy
// idx?
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy') as string
    const idx = req.nextUrl.searchParams.get('idx')
    return await HolderFrame(idx ? +idx : 0, tokenAddy)
}

// POST /api/holders
// Params:
// tokenAddy
// idx
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const idx = +searchParams.get('idx')!
    const tokenAddy = searchParams.get('tokenAddy') as string
    const data: FrameSignaturePacket = await req.json()
    
    // Route request
    if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 2: Pressed Back button from page index 0
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 3: Pressed Back button from page index not 0
        return await HolderFrame(idx - 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        return await HolderFrame(idx + 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 5: pressed "home" button
        const res =  await fetch(AppConfig.hostUrl + `/api/home`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
        // TODO: Linkout
    // } else if (data.untrustedData.buttonIndex == 4) {
    //     const collection = await zdk.collection({
    //         address: tokenAddy!,
    //         includeFullDetails: true
    //     })
    //     console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
    //     const networkName = collection.networkInfo.network!.toLowerCase()
    //     console.log(`networkName: ${networkName}`)
    //     return new NextResponse(null, {
    //         status: 302,
    //         headers: { Location: `https://zora.co/${networkName}:${tokenAddy}` },
    //       });
    } else {
        // Case 5: Routing error
        const errorMsg = 'Bad route. Watch this cast to be notified of updates.'
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}tokenAddy=${tokenAddy}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
}
