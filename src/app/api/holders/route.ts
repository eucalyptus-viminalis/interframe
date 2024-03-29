import { NextRequest } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
import { FrameButton } from "@/src/fc/FrameButton";
import { getHolderData } from "./data";

// export const config = {
//   runtime: 'edge',
// }

const MAX_ROUTE_LENGTH = 10; // Maximum number of top holders to show
const LAST_INDEX = MAX_ROUTE_LENGTH - 1; // Last page index to show

async function HolderFrame(idx: number, tokenAddy: string, currentUrl: string) {
    // Init frameContent
    const frameContent: FrameContent = {
        frameButtons: [],
        frameImageUrl: AppConfig.hostUrl,
        framePostUrl:
            AppConfig.hostUrl +
            `/api/holders?idx=${idx}&tokenAddy=${tokenAddy}`,
        frameTitle: "holders | interframe",
        frameVersion: "vNext",
    };
    // Try get Holder data
    try {
        // throw new Error('force throw')
        const data = await getHolderData(tokenAddy, idx);
        frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${tokenAddy}`;
        frameContent.frameImageUrl += `&to=${data.ownerAddress}&count=${data.count}`;
        frameContent.frameImageUrl += `&rank=${idx}&tokenName=${data.tokenName ? encodeURIComponent(data.tokenName) : ""}`;
        // Generate market link
        const zoraNetworkName = 
            data.networkName.toLowerCase() == 'ethereum'
            ? 'eth' 
            : data.networkName.toLowerCase()
        
        const marketLink = `https://zora.co/collect/${zoraNetworkName}:${tokenAddy}`;
        const frameButtons: FrameButton[] =
            idx >= data.numHolders || idx >= LAST_INDEX
                ? [
                      {
                          action: "post",
                          label: "<back",
                      },
                      {
                          action: "post",
                          label: "<summary",
                      },
                  ]
                : [
                      {
                          action: "post",
                          label: "<back",
                      },
                      {
                          action: "post",
                          label: "next>",
                      },
                      {
                          action: "post",
                          label: "<summary",
                      },
                  ];
        frameContent.frameButtons = frameButtons;
        // If it's the last holder to show, append a query param to postUrl
        if (idx >= data.numHolders || idx >= LAST_INDEX) {
            frameContent.framePostUrl += '&last=true'
        }
        // Try get FC user details
        try {
            const user = await client.lookupUserByVerification(
                data.ownerAddress
            );
            const username = user.result.user.username;
            const pfp = user.result.user.pfp.url;
            frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
            // Add button to warpcast profile if found
            const wcProfileLink = `https://warpcast.com/${username}`
            frameContent.frameButtons.push({action: 'link', label: 'WC Profile', target: wcProfileLink})

        } catch {
            console.log("Farcaster user not found!");
        }
        return Frame200Response(frameContent);
    } catch {
        const errorMsg = encodeURIComponent('No holder information found. Please try again.');
        const backUrl = encodeURIComponent(currentUrl)
        const res = await fetch(
            AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&backUrl=${backUrl}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
}

// GET: /api/holder
// Params:
// idx?
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy") as string;
    const idx = req.nextUrl.searchParams.get("idx");
    return await HolderFrame(idx ? +idx : 0, tokenAddy, req.nextUrl.toString());
}

// POST /api/holders
// Params:
// idx
// tokenAddy
// last?: "true" | undefined
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const idx = +searchParams.get("idx")!;
    const tokenAddy = searchParams.get("tokenAddy") as string;
    const last = searchParams.get("last");
    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 1: Pressed Back button from page index 0
        // - go to summary page
        const res = await fetch(
            AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 2: Pressed Back button from page index not 0
        // - go to previous holder
        return await HolderFrame(idx - 1, tokenAddy, req.nextUrl.toString());
    } else if (data.untrustedData.buttonIndex == 2 && last != 'true') {
        // Case 3: Pressed Next button
        // - go to next holder
        return await HolderFrame(idx + 1, tokenAddy, req.nextUrl.toString());
    } else if (data.untrustedData.buttonIndex == 3 && last != 'true') {
        // Case 4: pressed "summary" button
        // - go to summary 
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=` + tokenAddy);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 2 && last == 'true') {
        // Case 4: pressed "summary" button from last page
        const res = await fetch(AppConfig.hostUrl + `/api/summary?tokenAddy=` + tokenAddy);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 4) {
        // Case 5:
        // - link out
        // > No need to handle this as it's handled by Farcaster client with 'link' button action type
    } else {
        // Case 5: Routing error
        const errorMsg = encodeURIComponent(
            "Bad route. Watch this cast to be notified of updates."
        );
        const res = await fetch(
            AppConfig.hostUrl +
                `/api/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
}
