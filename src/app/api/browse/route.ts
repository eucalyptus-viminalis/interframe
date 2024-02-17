import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { NextRequest } from "next/server";
import { AppConfig } from "../../AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { zdk } from "@/src/zdk/client";

export async function GET() {
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


// POST: /api/browse
// Params:
// tokenAddy1!: string
// tokenAddy2!: string
export async function POST(req: NextRequest) {
    const data: FrameSignaturePacket = await req.json()
    const tokenAddy1 = req.nextUrl.searchParams.get('tokenAddy1')
    const tokenAddy2 = req.nextUrl.searchParams.get('tokenAddy2')!
    if (!tokenAddy1) {
        return new Response('missing param: tokenAddy1', {status: 400})
    } else if (!tokenAddy2) {
        return new Response('missing param: tokenAddy2', {status: 400})
    }
    // Route request
    if (data.untrustedData.buttonIndex == 3) {
        // Case 1: pressed "home" button
        // - go to home page (refresh)
        const res = await fetch(AppConfig.hostUrl + `/api/home`)
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 2: pressed action button 1
        // - go to summary page for selected token
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy1}`)
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 3: pressed action button 2
        // - go to summary page for selected token
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy2}`)
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 4) {
        // Case 4: pressed "random" button
        // - return with a different random selection of tokens
        const res = await fetch(AppConfig.hostUrl + '/api/browse')
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    } else {
        const errorMsg = encodeURIComponent("Bad route. Watch this cast to be notified of updates.")
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`)
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    }
}