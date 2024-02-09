import { AppConfig } from "@/src/app/AppConfig";
import { Frame200Response } from "@/src/_fc/Frame200Response";
import { FrameContent } from "@/src/_fc/FrameContent";
import { FrameSignaturePacket } from "@/src/_fc/FrameSignaturePacket";
import { zdk } from "@/src/_zora/zsk";
import { NextRequest } from "next/server";

// Route segment config
// export const dynamic = 'force-dynamic'
// export const revalidate = '0'
// export const fetchCache = 'force-no-store'

// Data we want to display in the frame image

// FRAME CONTENT //
const frameContent: FrameContent = {
    frameButtons: [],
    frameImageUrl: "",
    framePostUrl: AppConfig.hostUrl + '/api/home',
    frameTitle: "see Zora",
    frameVersion: "vNext"
}

// GET /api/home
export async function GET(req: NextRequest) {

    frameContent.frameImageUrl = AppConfig.hostUrl
        + "/api/image/home"
    frameContent.frameButtons = [
        {
            action: "post",
            label: "Refresh"
        },
        {
            action: "post",
            label: "Browse"
        },
        {
            action: "post",
            label: "Search"
        },
        // TODO: Some redirect
        // {
        //     action: "post_redirect",
        //     label: "<See Zora>"
        // }
    ]
    return Frame200Response(frameContent)
}

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tokenAddy = searchParams.get('tokenAddy')
    const data: FrameSignaturePacket = await req.json()
    const buttonIndex = data.untrustedData.buttonIndex

    // Case 1: pressed "Home" button
    if (buttonIndex == 1) {
        return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`)
    } else if (buttonIndex === 2) {
        // Case 2: If pressed "Latest Mints" button
        const response = await fetch(AppConfig.hostUrl + `/api/latest-mints?from=home&tokenAddy=${tokenAddy}`, {
            method: 'POST', // specify the method of your original request
            headers: {
                'Content-Type': 'application/json', // adjust headers if needed
            },
            body: JSON.stringify(data), // send the original request body
        });

        // Handle the response and return it
        if (response.ok) {
            const responseData = response.body;
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        } else {
            return new Response('Error handling the request', {
                status: response.status,
            });
        }
    } else if (buttonIndex == 3) {
        // Case 3: If "Holders" button clicked
        const response = await fetch(AppConfig.hostUrl + `/api/holders?from=home&tokenAddy=${tokenAddy}`, {
            method: 'POST', // specify the method of your original request
            headers: {
                'Content-Type': 'application/json', // adjust headers if needed
            },
            body: JSON.stringify(data), // send the original request body
        });

        // Handle the response and return it
        if (response.ok) {
            console.log('RESPONSE OK!')
            const responseData = response.body;
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        } else {
            return new Response('Error handling the request', {
                status: response.status,
            });
        }
    } else if (buttonIndex == 4) {
        // Try input
        const input = data.untrustedData.inputText!
        if (!isValidEthereumAddress(input)) {
            frameContent.frameButtons = [
                {
                    action: 'push',
                    label: '<Home>'
                }
            ]
            const msg = 'Input error. Enter a valid Ethereum address'
            frameContent.frameImageUrl = AppConfig.hostUrl + `/api/image/error?tokenAddy=${tokenAddy}&msg=${msg}`
            frameContent.input = false
            return Frame200Response(frameContent)
        } else {
            return await fetch(AppConfig.hostUrl + `/api/home?tokenAddy=${input}`)
        }
        
    }

}

function isValidEthereumAddress(address: string): boolean {
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  
    return ethereumAddressRegex.test(address);
  }
