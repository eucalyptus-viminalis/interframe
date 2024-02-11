import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { AppConfig } from "../../AppConfig";
import { FrameContent } from "@/src/fc/FrameContent";

async function AboutFrame() {
    const frameContent: FrameContent = {
        frameButtons: [
            {action: 'post', label: 'home'},
            {action: 'link', label: 'GitHub', target: AppConfig.gitHubUrl}
        ],
        frameImageUrl: AppConfig.hostUrl + '/api/image/about',
        framePostUrl: AppConfig.hostUrl + '/api/about',
        frameTitle: 'about | interframe',
        frameVersion: 'vNext'
    }
    const text = encodeURIComponent("See more on GitHub.")
    frameContent.frameImageUrl += `?text=${text}`
    return Frame200Response(frameContent)
}

export async function GET(req: NextRequest) {
    return await AboutFrame()
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')

    const errorMsg = "Bad route. Ping @3070 to improve this frame."
    const res = await fetch(AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`)
    return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
}