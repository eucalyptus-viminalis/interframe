import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";

function RoutingErrorFrame(errorMsg?: string, tokenAddy?: string) {
    // Init frameContent
    const frameContent: FrameContent = {
        frameButtons: [
            {
                action: "post",
                label: "home",
            },
        ],
        frameImageUrl:
            AppConfig.hostUrl +
            `/api/image/error?tokenAddy=${tokenAddy}&msg=${errorMsg}`,
        framePostUrl:
            AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}`,
        frameTitle: "see Zora | Holders (graph)",
        frameVersion: "vNext",
    };
    console.log(`Could not get holder info results.`);
    frameContent.frameButtons = [
        {
            action: "push",
            label: "<Home>",
        },
    ];
    return Frame200Response(frameContent);
}

// GET: /api/error?errorMsg&tokenAddy
export function GET(req: NextRequest) {
    const errorMsg = req.nextUrl.searchParams.get("errorMsg");
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    return RoutingErrorFrame(errorMsg ?? undefined, tokenAddy ?? undefined);
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy");
    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (data.untrustedData.buttonIndex == 1) {
        // Case 1: Home button is pressed
        // - take user to home route
        return await fetch(
            AppConfig.hostUrl + `/api/home`
        );
    } else {
        // Case 2: Routing failure
        // - take user to error page
        const errorMsg = "DEBUG: API routing failed."
        return await fetch(AppConfig.hostUrl + `/api/error?tokenAddy=${tokenAddy}&msg=${errorMsg}`)
    }
}
