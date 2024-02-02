import { NextRequest, NextResponse } from "next/server";



// /[tokenAddy]/mint/[id]
export function POST(req: NextRequest, context: {params: {tokenAddy: string}}) {
    const {tokenAddy} = context.params
    console.log(tokenAddy)

    // Get mint details

    // Response
    return new Response()
}