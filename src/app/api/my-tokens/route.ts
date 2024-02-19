import { NextRequest } from "next/server";
import { MyTokensFrame } from "./frame";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { AppConfig } from "../../AppConfig";

export async function GET(req: NextRequest) {
    const eoas = req.nextUrl.searchParams.get('eoas')
    const blockchain = req.nextUrl.searchParams.get('blockchain')
    if (!eoas) {
        return new Response("missing param: eoa", { status: 400 });
    } else if (!blockchain) {
        return new Response("missing param: blockchain", {status: 400})
    }
    return await MyTokensFrame(eoas, blockchain)
}

export async function POST(req: NextRequest) {
    const data: FrameSignaturePacket = await req.json()
    const tokenAddy1 = req.nextUrl.searchParams.get('tokenAddy1')
    const eoas = req.nextUrl.searchParams.get('eoas')!
    const blockchain = req.nextUrl.searchParams.get('blockchain')!
    const tokenAddy2 = req.nextUrl.searchParams.get('tokenAddy2')

    // route request
    if (data.untrustedData.buttonIndex == 1) {
        const res = await fetch(AppConfig.hostUrl + '/api/home')
        return new Response(res.body, {headers:{'content-type':'text/html'}})
    } else if (data.untrustedData.buttonIndex == 2 && tokenAddy1) {
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy1}`)
        return new Response(res.body, {headers:{'content-type':'text/html'}})
    } else if (data.untrustedData.buttonIndex == 3 && tokenAddy2) {
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy2}`)
        return new Response(res.body, {headers:{'content-type':'text/html'}})
    } else if (data.untrustedData.buttonIndex == 3 && !tokenAddy2) {
        // This is impossible
        const res = await fetch(AppConfig.hostUrl + '/api/error')
        return new Response(res.body, {headers:{'content-type':'text/html'}})
    } else if (data.untrustedData.buttonIndex == 4) {
        const res = await fetch(AppConfig.hostUrl + `/api/my-tokens?eoas=${eoas}&blockchain=${blockchain}`)
        return new Response(res.body, {headers:{'content-type':'text/html'}})
    }
}