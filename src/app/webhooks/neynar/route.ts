import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json()
    console.log('web hook request received.', JSON.stringify(data))
    return new Response(JSON.stringify(data), {headers: {'content-type': 'application/json'}})
}