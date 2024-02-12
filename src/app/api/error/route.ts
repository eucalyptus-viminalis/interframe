import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { FrameButton } from "@/src/fc/FrameButton";

function ErrorFrame(errorMsg: string, tokenAddy?: string, backUrl?: string) {
    // Init frameContent
    const frameButtons: FrameButton[] = backUrl ? 
        [{action: 'post', label: '🔴'}, {action: 'post', label: '🟣'}]
        :
        [{action: 'post', label: '🟣'}]
    const frameContent: FrameContent = {
        frameButtons: frameButtons,
        frameImageUrl:
            AppConfig.hostUrl +
            `/api/image/error?tokenAddy=${tokenAddy ?? ''}&msg=${encodeURIComponent(errorMsg)}&backUrl=${backUrl ? 'true' : ''}`,
        framePostUrl:
            AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}&backUrl=${backUrl ? encodeURIComponent(backUrl) : ""}`,
        frameTitle: "error | interframe",
        frameVersion: "vNext",
    };
    return Frame200Response(frameContent);
}

// GET: /api/error
// Params:
// - errorMsg!
// - tokenAddy?
// - backUrl?
export function GET(req: NextRequest) {
    const errorMsg = req.nextUrl.searchParams.get("errorMsg");
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const backUrl = req.nextUrl.searchParams.get('backUrl')
    return ErrorFrame(errorMsg ?? "Error", tokenAddy ?? undefined, backUrl ?? undefined);
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const backUrl = req.nextUrl.searchParams.get('backUrl');
    const data: FrameSignaturePacket = await req.json();

    // Route request
    // backUrl present:
    if (backUrl && data.untrustedData.buttonIndex == 1) {
        const res = await fetch(decodeURIComponent(backUrl))
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
    if (data.untrustedData.buttonIndex == 1) {
        // Case 1: Home button is pressed
        // - take user to home route
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else {
        // Case 2: Routing failure
        // - take user to error page
        const errorMsg = "Bad route. Watch this cast to be notified of changes."
        const res = await fetch(AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}&errorMsg=${errorMsg}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
}
