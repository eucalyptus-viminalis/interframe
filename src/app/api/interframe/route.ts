import { Frame200Response } from "@/src/fc/Frame200Response";
import { NextRequest } from "next/server";
import { AppConfig } from "../../AppConfig";

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')

    const errorMsg = "Under construction. Watch this cast to be notified of updates."
    const res = await fetch(AppConfig.hostUrl + `/api/image/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`)
    return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
}

export async function POST(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')

    const errorMsg = "Under construction. Watch this cast to be notified of updates."
    const res = await fetch(AppConfig.hostUrl + `/api/image/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`)
    return new Response(res.body, {headers:{'Content-Type': 'text/html'}})
}