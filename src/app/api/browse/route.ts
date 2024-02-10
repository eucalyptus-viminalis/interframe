import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { NextRequest } from "next/server";
import { AppConfig } from "../../AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { zdk } from "@/src/zora/zsk";


export async function GET(req: NextRequest) {
    const frameContent: FrameContent = {
        frameButtons: [],
        frameImageUrl: "",
        framePostUrl: AppConfig.hostUrl + '/api/browse',
        frameTitle: 'interframe/browse',
        frameVersion: 'vNext',
    }
    // Select two random contract addresses
    const randomAddys = Object.values(AppConfig.contracts)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
    const [token1, token2] = await Promise.all([
        zdk.collection({address: randomAddys[0], includeFullDetails: false}),
        zdk.collection({address: randomAddys[1], includeFullDetails: false}),
    ])
    const token1Text = encodeURIComponent(token1.name ?? randomAddys[0])
    const token2Text = encodeURIComponent(token2.name ?? randomAddys[1])
    frameContent.frameImageUrl = AppConfig.hostUrl + `/api/image/browse?token1Text=${token1Text}&token2Text=${token2Text}`
    frameContent.framePostUrl += `?tokenAddy1=${randomAddys[0]}&tokenAddy2=${randomAddys[1]}`
    frameContent.frameButtons = [
        {action: 'post', label: '🔴'}, {action: 'post', label: '🔵'},
        {action: 'post', label: '🟣'}, {action: 'post', label: '🟢'}
    ]
    return Frame200Response(frameContent)
}

export async function POST(req: NextRequest) {
    const data: FrameSignaturePacket = await req.json()
    const tokenAddy1 = req.nextUrl.searchParams.get('tokenAddy1')
    // Route request
    if (data.untrustedData.buttonIndex == 3) {
        // Case 1: pressed "home" button
        // - go to home page (refresh)
        return await fetch(AppConfig.hostUrl + `/api/home`)
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 2: pressed action button 1
        return await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy1}`)
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 3: pressed action button 2
        return await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy1}`)
    } else if (data.untrustedData.buttonIndex == 4) {
        // Case 4: pressed "random" button
        return await fetch(AppConfig.hostUrl + '/api/browse')
    }
}