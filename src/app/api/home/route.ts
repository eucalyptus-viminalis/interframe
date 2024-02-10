import { AppConfig } from "@/src/app/AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";

// Route segment config
// export const dynamic = 'force-dynamic'
// export const revalidate = '0'
// export const fetchCache = 'force-no-store'

// FRAME CONTENT //
const frameContent: FrameContent = {
    frameButtons: [],
    frameImageUrl: "",
    framePostUrl: AppConfig.hostUrl + "/api/home",
    frameTitle: "interframe",
    frameVersion: "vNext",
};

// GET /api/home
export async function GET(req: NextRequest) {
    frameContent.frameImageUrl = AppConfig.hostUrl + "/api/image/home";
    frameContent.frameButtons = [
        {
            action: "post",
            label: "home",
        },
        {
            action: "post",
            label: "browse",
        },
        {
            action: "post",
            label: "search",
        },
        {
            action: "post",
            label: "interframe?",
        },
    ];
    return Frame200Response(frameContent);
}

// POST: /api/home
export async function POST(req: NextRequest) {
    const data: FrameSignaturePacket = await req.json();
    const buttonIndex = +data.untrustedData.buttonIndex;

    // Route request
    if (buttonIndex == 1) {
        // Case 1: pressed "home" button
        // - go to home page (refresh)
        const response = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(response.body, {headers: {'Content-Type': 'text/html'}})
    } else if (buttonIndex == 2) {
        // Case 2: pressed "browse" button
        // - go to browse page
        const response = await fetch(AppConfig.hostUrl + `/api/browse`)
        return new Response(response.body, {headers: {'Content-Type': 'text/html'}})
    } else if (buttonIndex == 3) {
        // Case 3: pressed "search" button
        // - go to search page
        const res = await fetch(AppConfig.hostUrl + `/api/search`);
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else if (buttonIndex == 4) {
        // Case 4: pressed "interframe"
        // - go to interframe page
        const res = await fetch(AppConfig.hostUrl + `/api/interframe`);
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else {
        // Case 5: bad request
        const errorMsg = `Bad request\nat route: ${req.nextUrl}\nbuttonIndex: ${data.untrustedData.buttonIndex}`;
        const res = await fetch(
            AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`
        );
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
}
