import { NextRequest } from "next/server";
import { getData } from "./data";


export async function GET(req: NextRequest) {
    const ca = req.nextUrl.searchParams.get('ca')
    const blockchain = req.nextUrl.searchParams.get('blockchain')
    if (!(ca && blockchain)) {
        return new Response('requires "ca" and "blockchain"', {status: 400})
    }
    const data = await getData(ca, blockchain)
    return new Response(JSON.stringify(data), {headers: {'content-type': 'application/json'}})
}