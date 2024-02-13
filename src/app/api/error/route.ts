import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { FrameButton } from "@/src/fc/FrameButton";

function ErrorFrame(errorMsg?: string | null, tokenAddy?: string | null, backUrl?: string | null) {
    // Init frameContent
    const frameButtons: FrameButton[] = backUrl != null ? 
        [{action: 'post', label: '🔴'}, {action: 'post', label: '🟣'}]
        :
        [{action: 'post', label: '🟣'}]
    const frameContent: FrameContent = {
        frameButtons: frameButtons,
        frameImageUrl:
            AppConfig.hostUrl +
            `/api/image/error?tokenAddy=${tokenAddy ?? ''}&msg=${errorMsg ? encodeURIComponent(errorMsg) : ''}&backUrl=${backUrl ? 'true' : ''}`,
        framePostUrl:
            AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy ?? ''}&backUrl=${backUrl ? encodeURIComponent(backUrl) : ''}`,
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
    return ErrorFrame(errorMsg, tokenAddy, backUrl);
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const backUrl = req.nextUrl.searchParams.get('backUrl');
    const data: FrameSignaturePacket = await req.json();

    // Route request
    // backUrl present:
    if (backUrl && data.untrustedData.buttonIndex == 1) {
        // Case 1: pressed "back" button
        const res = await fetch(decodeURIComponent(backUrl))
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else if (backUrl && data.untrustedData.buttonIndex == 2) {
        // Case 2: pressed "home" button when backUrl given
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else if (!backUrl && data.untrustedData.buttonIndex == 1) {
        // Case 3: Home button is pressed
        // - take user to home route
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    } else {
        // Case 4: Routing unhandled
        // - take user to error page
        const errorMsg = encodeURIComponent("Bad route. Watch this cast to be notified of updates.")
        const res = await fetch(AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}&errorMsg=${errorMsg}&backUrl=${backUrl}`)
        return new Response(res.body, {headers: {'Content-Type': 'text/html'}})
    }
}
