import { NextRequest } from "next/server"
import { AppConfig } from "../../AppConfig"
import { Frame200Response } from "@/src/fc/Frame200Response"
import { FrameContent } from "@/src/fc/FrameContent"
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket"
import "@/src/utils/ethereum-address";

async function SearchFrame() {
    const frameContent: FrameContent = {
        frameButtons: [
            {action: 'post', label: '<submit>'},
            {action: 'post', label: '<home>'},
        ],
        frameImageUrl: AppConfig.hostUrl + '/api/image/search',
        framePostUrl: AppConfig.hostUrl + '/api/search',
        frameTitle: 'search | interframe',
        frameVersion: 'vNext',
        input: true,
    }
    return Frame200Response(frameContent)
}

export async function GET(req: NextRequest) {
    return await SearchFrame()
}

export async function POST(req: NextRequest) {
    const data: FrameSignaturePacket = await req.json();
    if (data.untrustedData.buttonIndex == 2) {
        // Case 1: pressed home button
        const res = await fetch(AppConfig.hostUrl + '/api/home')
        return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
    }
    if (!data.untrustedData.inputText) {
        // Case 2: no input text
        // - take user to error page with backUrl to /api/search
        const errorMsg = encodeURIComponent('No input submitted.')
        const backUrl = AppConfig.hostUrl + '/api/search'
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&backUrl=${backUrl}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
    if (!data.untrustedData.inputText.isValidEthereumAddress()) {
        // Case 3: not valid ethereum address
        // - take user to error page with backUrl to /api/search
        const errorMsg = encodeURIComponent('Invalid input. Please enter a valid 0x ethereum addresss.')
        const backUrl = AppConfig.hostUrl + '/api/search'
        const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&backUrl=${backUrl}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else {
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=${data.untrustedData.inputText}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
}


function isValidEthereumAddress(address: string): boolean {
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  
    return ethereumAddressRegex.test(address);
  }