import { NextRequest } from "next/server";
import { getData } from "./data";

export async function GET(req: NextRequest) {
    const eoas = req.nextUrl.searchParams.get('eoas')
    if (!eoas) {
        return new Response('missing param: "eoas"', {status: 400})
    }
    const data = await getData(eoas.split(','))
    console.log('zora length', data.Zora.TokenBalance.length)
    console.log('base length', data.Base.TokenBalance.length)
    console.log('ethereum length', data.Ethereum.TokenBalance.length)
    return new Response(JSON.stringify(data), {headers: {'content-type':'application/json'}})
}