import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";

function RoutingErrorFrame(errorMsg: string, tokenAddy?: string) {
    // Init frameContent
    const frameContent: FrameContent = {
        frameButtons: [
            {
                action: "post",
                label: "🟣",
            },
        ],
        frameImageUrl:
            AppConfig.hostUrl +
            `/api/image/error?tokenAddy=${tokenAddy}&msg=${encodeURIComponent(errorMsg)}}`,
        framePostUrl:
            AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}`,
        frameTitle: "error | interframe",
        frameVersion: "vNext",
    };
    return Frame200Response(frameContent);
}

// GET: /api/error?errorMsg&tokenAddy
export function GET(req: NextRequest) {
    const errorMsg = req.nextUrl.searchParams.get("errorMsg");
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    return RoutingErrorFrame(errorMsg ?? "Error", tokenAddy ?? undefined);
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const data: FrameSignaturePacket = await req.json();

    // Route request
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
