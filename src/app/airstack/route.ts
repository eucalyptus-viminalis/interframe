import { NextRequest } from "next/server";
import { getData } from "./data";

export async function GET(req: NextRequest) {
    const data = await getData()
    console.log(JSON.stringify(data,null,2))
    return new Response(JSON.stringify(data), {headers: {'content-type': 'application/json'}})
}