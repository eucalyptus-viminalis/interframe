import { NextRequest } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { zdk } from "@/src/zora/zsk";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
import { ipfsSrcToUrl } from "@/src/_ipfs/ipfs";
import { SortDirection } from "@zoralabs/zdk";
import { MintSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";

// export const config = {
//   runtime: 'edge',
// }



async function MintFrame(idx: number, collectionAddress: string) {
    const frameContent: FrameContent = {
        frameButtons: [],
        frameImageUrl: AppConfig.hostUrl,
        framePostUrl: AppConfig.hostUrl + `/api/latest-mints?idx=${idx}&tokenAddy=${collectionAddress}`,
        frameTitle: "see Zora | latest mints",
        frameVersion: 'vNext',
    }
    // Get mint transfers
    const res = await zdk.mints({
        where: {
            collectionAddresses: [collectionAddress],
        },
        includeFullDetails: false,
        includeMarkets: false,
        sort: {
            sortDirection: "DESC" as SortDirection,
            sortKey: "TIME" as MintSortKey
        }
    })
    // Set button names
    frameContent.frameButtons = res.mints.nodes.length - 1 <= idx ?
        [
            {
                action: 'push',
                label: '<< Back'
            },
            {
                action: 'push',
                label: 'Home'
            }
        ] 
        : 
        [
            {
                action: 'push',
                label: '<< Back'
            },
            {
                action: 'push',
                label: 'Next >>'
            },
            {
                action: 'push',
                label: 'Home'
            }
        ]
    const mint = res.mints.nodes[idx]
    console.log(`mint.token.image.url: ${JSON.stringify(mint.token?.image?.url, null, 2)}`)
    const img = ipfsSrcToUrl(mint.token!.image!.url!)
    // const img = sanitiseForPossibleIPFS(mint.token?.image?.url)
    const tokenId = mint.mint.tokenId
    const mintTimestamp = mint.mint.transactionInfo.blockTimestamp
    const to = mint.mint.toAddress
    frameContent.frameImageUrl += `/api/image/mint?img=${img}&tokenId=${tokenId}&mintTimestamp=${mintTimestamp}&to=${to}&date=${Date.now()}`

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
        const res = await MintFrame(0, tokenAddy)
        return res
    } else if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 2: Pressed Back button from page index 0
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 3: Pressed Back button from page index not 0
        return await MintFrame(idx - 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        return await MintFrame(idx + 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 3) {
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    }
    // Case 5: Pressed redirect to Zora button
    console.log(`FIXME: routing case not found`)
    return new Response()
}


export async function GET(req: NextRequest) {
    console.log('GET /api/mint')
    return new Response()
}