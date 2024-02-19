import { NextRequest } from "next/server";
import { SelectBlockchainFrame } from "./frame";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { AppConfig } from "../../AppConfig";

export async function GET(req: NextRequest) {
    const fid = req.nextUrl.searchParams.get('fid')!
    return await SelectBlockchainFrame(+fid)
}

export async function POST(req: NextRequest) {
    const eoas = req.nextUrl.searchParams.get('eoas')!
    const data: FrameSignaturePacket = await req.json()

    // Route request
    if (data.untrustedData.buttonIndex == 1){
        const res = await fetch(AppConfig.hostUrl + '/api/home')
        return new Response(res.body, {headers: {'content-type':'text/html'}})
    } else if (data.untrustedData.buttonIndex == 2) {
        const res = await fetch(AppConfig.hostUrl + `/api/my-tokens?blockchain=base&eoas=${eoas}`)
        return new Response(res.body, {headers: {'content-type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 3) {
        const res = await fetch(AppConfig.hostUrl + `/api/my-tokens?blockchain=ethereum&eoas=${eoas}`)
        return new Response(res.body, {headers: {'content-type': 'text/html'}})
    } else if (data.untrustedData.buttonIndex == 4) {
        const res = await fetch(AppConfig.hostUrl + `/api/my-tokens?blockchain=zora&eoas=${eoas}`)
        return new Response(res.body, {headers: {'content-type': 'text/html'}})
    }
}