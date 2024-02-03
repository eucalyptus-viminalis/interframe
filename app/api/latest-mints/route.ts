import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from '@vercel/og'
import { NextApiRequest } from 'next'
import { ReactNode } from 'react'
import { AppConfig } from "@/app/AppConfig";
import { FrameSignaturePacket } from "@/fc/FrameSignaturePacket";
import { Frame200Response } from "@/fc/Frame200Response";
import { ZoraTransfersResposeBody } from "@/zora/blockscout";
import { zdk } from "@/zora/zsk";
import { CA_ZAIBS } from "@/zora/consts";
import { client } from "@/neynar/client";
import { FrameContent } from "@/fc/FrameContent";

// export const config = {
//   runtime: 'edge',
// }

const transfersQuery =
    AppConfig.zoraRestUrl + "/tokens/0x040cabddc5c1ed83b66e0126e74e7f97e6ec36bc/transfers";
const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";

// POST /api/latest-mints //

async function MintFrame(idx: number, collectionAddress: string) {
    const frameContent: FrameContent = {
        frameButtonNames: [""],
        frameImageUrl: AppConfig.hostUrl,
        framePostUrl: AppConfig.hostUrl + `/api/latest-mints?idx=${idx}`,
        frameTitle: "see Zora | latest mints",
        frameVersion: 'vNext',
    }
    // Get mint transfers
    const res = await zdk.mints({
        where: {
            collectionAddresses: [collectionAddress],
        },
        includeFullDetails: false,
        includeMarkets: false
    })
    const mint = res.mints.nodes[idx]
    console.log(`mint: ${JSON.stringify(mint, null, 2)}`)
    const img = mint.token?.image?.mediaEncoding?.original
    const tokenId = mint.mint.tokenId
    const mintTimestamp = mint.mint.transactionInfo.blockTimestamp
    const to = mint.mint.toAddress
    frameContent.frameImageUrl += `/api/image/mint?img=${img}&tokenId=${tokenId}&mintTimestamp=${mintTimestamp}&to=${to}&date=${Date.now()}`

    // TODO: GET FARCASTER USER DETAILS
    let frameImageUrl;
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

    console.log(`GraphQL res: ${JSON.stringify(to, null, 2)}`)
    // const response = await fetch(transfersQuery);
    // const resBody: ZoraTransfersResposeBody = await response.json();
    // const transfers = resBody.items
    // const mints = transfers.filter(tx => tx.type == "token_minting")
    // console.log(`total: ${transfers.length}, mints: ${mints.length}`)
    // const transfer = transfers[idx];
    // const tokenId = transfer.total.token_id;
    // const addy = transfer.to.hash;
    // const ens = transfer.to.ens_domain_name;

    // // DEBUG
    // console.log(`addy: ${addy}`);
    // const tokenUri = await get1155Uri(ZAIB_CONTRACT_ADDRESS, BigInt(tokenId));
    // console.log(tokenUri);
    // const tokenImageUrl = await erc1155UriToImage(tokenUri);
    // console.log(`tokenImageUrl: ${tokenImageUrl}`);

    // // zaib mint image
    // // var content = HOST_URL + "/meme-0.png?date=" + Date.now()
    // // if (btnIndex) {
    // //     content = HOST_URL + "/frame-devs.png?date=" + Date.now()
    // // }
    // // var frameImage = HOST_URL + `/api/dynamic-image?username=beginbot`
    // var frameImage =
    //     HOST_URL +
    //     `/api/zaib-minted?id=${tokenId}&addy=${addy}&ens=${ens}&tokenImgUrl=${tokenImageUrl}&date=${Date.now()}`;
    // console.log(frameImage);

    // // Debug
    // console.log(btnIndex);
    // return Frame200Response()
    return new Response()
}

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy') as string
    const from = searchParams.get('from')
    const data: FrameSignaturePacket = await req.json()
    // Case 1: Called from /api/home
    // - show latest mint
    if (from == "home") {
        const res = await MintFrame(0, tokenAddy)
        return res
    }


    // Case 2: Pressed Back button from page index 0
    // Case 3: Pressed Back button from page index not 0
    // Case 4: Pressed Next button
    // Case 5: Pressed redirect to Zora button
    // const buttonIndex
    console.log('POST /api/mint')
    return new Response()
}


export async function GET(req: NextRequest) {
    console.log('GET /api/mint')
    return new Response()
}