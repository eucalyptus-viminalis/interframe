import { NextRequest } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { MintFrame } from "./frame";

// GET: /api/latst-mints
// Params:
// idx?
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy") as string;
    const idx = req.nextUrl.searchParams.get("idx");
    return await MintFrame(idx ? +idx : 0, tokenAddy);
}

// POST /api/latest-mints
// Params:
// idx
// tokenAddy
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const idx = +searchParams.get("idx")!;
    const tokenAddy = searchParams.get("tokenAddy") as string;
    const last = searchParams.get("last");
    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 2: Pressed Back button from page index 0
        const res = await fetch(
            AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 3: Pressed Back button from page index not 0
        return await MintFrame(idx - 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 2 && last != 'true') {
        // Case 4: Pressed Next button
        return await MintFrame(idx + 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 2 && last == 'true') {
        // Case 4: Pressed "home" button
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 5: pressed "home" button
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
    // Case 5: Pressed redirect to Zora button
    console.log(`FIXME: routing case not found`);
    return new Response();
}
