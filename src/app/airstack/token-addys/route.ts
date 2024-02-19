import { NextRequest } from "next/server";
import { getData } from "./data";

export async function GET(req: NextRequest) {
    const eoas = req.nextUrl.searchParams.get('eoas')
    const blockchain = req.nextUrl.searchParams.get('blockchain')
    if (!eoas) {
        return new Response('missing param: "eoas"', {status: 400})
    } else if (!blockchain) {
        return new Response('missing param: "blockchain"', {status: 400})
    }
    const data = await getData(eoas.split(','), blockchain)
    return new Response(JSON.stringify(data), {headers: {'content-type':'application/json'}})
}