import { NextRequest } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { zdk } from "@/src/zora/zsk";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
import { ipfsSrcToUrl } from "@/src/ipfs/ipfs";
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
        },
        pagination: {
            limit: 10
        }
    })
    // Set buttons
    frameContent.frameButtons = res.mints.nodes.length - 1 <= idx ?
        [
            {
                action: 'post',
                label: '<back'
            },
            {
                action: 'post',
                label: '<home>'
            }
        ] 
        : 
        [
            {
                action: 'post',
                label: '<back'
            },
            {
                action: 'post',
                label: 'next>'
            },
            {
                action: 'post',
                label: '<home>'
            }
        ]
    const mint = res.mints.nodes[idx]
    console.log(`mint.token.image.url: ${JSON.stringify(mint.token?.image?.url, null, 2)}`)
    const img = ipfsSrcToUrl(mint.token!.image!.url!)
    // const img = sanitiseForPossibleIPFS(mint.token?.image?.url)
    const tokenId = mint.mint.tokenId
    const mintTimestamp = mint.mint.transactionInfo.blockTimestamp
    const to = mint.mint.toAddress
    frameContent.frameImageUrl += `/api/image/mint?img=${img}&tokenId=${tokenId}&mintTimestamp=${mintTimestamp}&to=${to}`

    try {
        // Example
        // vitalik.eth
        // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
        const user = await client.lookupUserByVerification(to);
        const username = user.result.user.username
        const pfp = user.result.user.pfp.url
        frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`
    } catch {
        console.log('neynar lookupUserByVerification failed.')
        // TODO: handle error
    }
    return Frame200Response(frameContent)
}

// GET: /api/latst-mints
// Params:
// idx?
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy') as string
    const idx = req.nextUrl.searchParams.get('idx')
    return await MintFrame(idx ? +idx : 0, tokenAddy)
}

// POST /api/latest-mints
// Params:
// idx
// tokenAddy
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
        return await MintFrame(idx - 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        return await MintFrame(idx + 1, tokenAddy)
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 5: pressed "home" button
        const res =  await fetch(AppConfig.hostUrl + `/api/home`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
    // Case 5: Pressed redirect to Zora button
    console.log(`FIXME: routing case not found`)
    return new Response()
}
