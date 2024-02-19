import { NextRequest } from "next/server";
import { getData } from "./data";

export async function GET(req: NextRequest) {
    const eoa = req.nextUrl.searchParams.get("eoa");
    const blockchain = req.nextUrl.searchParams.get("blockchain");
    if (!eoa) {
        return new Response("missing param: eoa", { status: 400 });
    } else if (!blockchain) {
        return new Response("missing param: blockchain", {status: 400})
    }
    const data = await getData(eoa, blockchain);
    return new Response(JSON.stringify(data, null, 2), {
        headers: { "content-type": "application/json" },
    });
}
