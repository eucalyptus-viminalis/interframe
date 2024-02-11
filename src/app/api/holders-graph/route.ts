import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { rankedOwnerByZdk, zdk } from "@/src/zora/zsk";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
import { Chain } from "@zoralabs/zdk/dist/queries/queries-sdk";
import {
    GraphCall,
    eth1155Holder,
    eth721Holder,
} from "@/src/the-graph/queries";
import { zoraRankedHolderByREST } from "@/src/zora/blockscout";

// export const config = {
//   runtime: 'edge',
// }

const MAX_ROUTE_LENGTH = 10; // Maximum number of top holders to show
const LAST_INDEX = MAX_ROUTE_LENGTH - 1; // Last page index to show

async function HolderFrame(idx: number, collectionAddress: string) {
    // Init frameContent
    const frameContent: FrameContent = {
        frameButtons: [],
        frameImageUrl: AppConfig.hostUrl,
        framePostUrl:
            AppConfig.hostUrl +
            `/api/holders-graph?idx=${idx}&tokenAddy=${collectionAddress}`,
        frameTitle: "see Zora | Holders (graph)",
        frameVersion: "vNext",
    };
    // Determine network and erc type
    const collection = await zdk.collection({
        address: collectionAddress,
        includeFullDetails: false,
    });
    console.log(`zdk.collection: ${JSON.stringify(collection, null, 2)}`);
    // Network info:
    const networkInfo = collection.networkInfo;

    // Switch on network chain
    if (networkInfo.chain == Chain.ZoraMainnet) {
        console.log("ZORA Mainnet detected!");
        const rankedHolder = await zoraRankedHolderByREST(
            collectionAddress,
            idx
        );
        frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}`;
        frameContent.frameImageUrl += `&to=${rankedHolder.addressHash}&count=${rankedHolder.totalValue}`;
        frameContent.frameImageUrl += `&rank=${idx + 1}`;
        try {
            // Example
            // vitalik.eth
            // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
            const user = await client.lookupUserByVerification(
                rankedHolder.addressHash
            );
            const username = user.result.user.username;
            const pfp = user.result.user.pfp.url;
            frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
        } catch {
            console.log("Farcaster user not found!");
        }
    } else if (networkInfo.chain == Chain.Mainnet) {
        console.log("ETH Mainnet detected!");
        try {
            // const { accountId, tokenCount } = await eth721Holder(
            //     collectionAddress,
            //     idx
            // );
            const [eth721Result, eth1155Result] = await Promise.all([
                eth721Holder(collectionAddress, idx),
                eth1155Holder(collectionAddress, idx),
            ]);
            // Check which result is available
            if (eth721Result) {
                // Handle eth721 result
                console.log("eth721Result!");
                const { account, tokenCount } = eth721Result;
                frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}&rank=${
                    idx + 1
                }`;
                frameContent.frameImageUrl += `&to=${account.id}&count=${tokenCount}`;
                // Get Farcaster user data
                try {
                    // Example
                    // vitalik.eth
                    // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
                    const user = await client.lookupUserByVerification(
                        account.id
                    );
                    const username = user.result.user.username;
                    const pfp = user.result.user.pfp.url;
                    frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
                } catch {
                    console.log("Farcaster user not found!");
                }
            } else if (eth1155Result) {
                // Handle eth1155 result
                console.log("eth1155Result!");
                const { account, balance } = eth1155Result;
                frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}&rank=${
                    idx + 1
                }`;
                frameContent.frameImageUrl += `&to=${account.id}&count=${balance}`;
                // Get Farcaster user data
                try {
                    // Example
                    // vitalik.eth
                    // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
                    const user = await client.lookupUserByVerification(
                        account.id
                    );
                    const username = user.result.user.username;
                    const pfp = user.result.user.pfp.url;
                    frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
                } catch {
                    console.log("Farcaster user not found!");
                }
            } else {
                console.log("Could not get holdings info");
                frameContent.frameButtons = [
                    {
                        action: "push",
                        label: "<Home>",
                    },
                ];
                const msg = "API error: No holder information found.";
                frameContent.frameImageUrl += `/api/image/error?tokenAddy=${collectionAddress}&msg=${msg}`;
            }
            // Set button names
            frameContent.frameButtons =
                idx >= 9
                    ? [
                          {
                              action: "push",
                              label: "<<Back",
                          },
                          {
                              action: "push",
                              label: "<Home>",
                          },
                      ]
                    : [
                          {
                              action: "push",
                              label: "<<Back",
                          },
                          {
                              action: "push",
                              label: "Next>>",
                          },
                          {
                              action: "push",
                              label: "Home",
                          },
                      ];
        } catch (error) {
            console.log(`error: ${error}`);
            frameContent.frameButtons = [
                {
                    action: "push",
                    label: "<Home>",
                },
            ];
            const msg = "API error: No holder information found.";
            frameContent.frameImageUrl += `/api/image/error?tokenAddy=${collectionAddress}&msg=${msg}`;
            return Frame200Response(frameContent);
        }

        // TODO: Other interesting stats? Last purchase, last sale? how many minted?

        // Return frame
        return Frame200Response(frameContent);
    } else if (networkInfo.chain == Chain.BaseMainnet) {
        console.log("Base Mainnet detected");
        // Try get ranked owner info
        const [zdkResult, base1155Result] = await Promise.all([
            rankedOwnerByZdk(collectionAddress, idx, networkInfo),
            GraphCall.base1155(collectionAddress, idx),
        ]);
        // Check which result is available
        if (zdkResult) {
            // Handle eth721 result
            console.log("zdkResult!");
            const { count, owner } = zdkResult;
            frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}&rank=${
                idx + 1
            }`;
            frameContent.frameImageUrl += `&count=${count}&to=${owner}`;
            try {
                // Example
                // vitalik.eth
                // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
                const user = await client.lookupUserByVerification(owner);
                const username = user.result.user.username;
                const pfp = user.result.user.pfp.url;
                frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
            } catch {
                console.log("Farcaster user not found!");
            }
        } else if (base1155Result) {
            console.log("base1155Result!");
            const { account, balance } = base1155Result;
            frameContent.frameImageUrl += `/api/image/holder?tokenAddy=${collectionAddress}&rank=${
                idx + 1
            }`;
            frameContent.frameImageUrl += `&count=${balance}&to=${account.id}`;
            try {
                // Example
                // vitalik.eth
                // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
                const user = await client.lookupUserByVerification(account.id);
                const username = user.result.user.username;
                const pfp = user.result.user.pfp.url;
                frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
            } catch {
                console.log("Farcaster user not found!");
            }
        } else {
            console.log(`Could not get holder info results.`);
            const errorMsg = encodeURIComponent(
                "No holder information found. Watch this cast to be notified about updates."
            );
            const res = await fetch(
                AppConfig.hostUrl +
                    `/api/error?errorMsg=${errorMsg}tokenAddy=${collectionAddress}`
            );
            return new Response(res.body, {
                headers: { "Content-Type": "text/html" },
            });
        }
    } else {
        console.log("Unsupported chain: " + networkInfo.chain);
    }
    // Return 200 response with FrameContent
    return Frame200Response(frameContent);
}

// function RoutingErrorFrame(errorMsg: string, tokenAddy: string) {
//     // Init frameContent
//     const frameContent: FrameContent = {
//         frameButtons: [{
//             action: "post",
//             label: "<Home>"
//         }],
//         frameImageUrl: AppConfig.hostUrl + `/api/image/error?tokenAddy=${tokenAddy}&msg=${errorMsg}`,
//         framePostUrl:
//             AppConfig.hostUrl +
//             `/api/holders-graph?idx=${idx}&tokenAddy=${collectionAddress}`,
//         frameTitle: "see Zora | Holders (graph)",
//         frameVersion: "vNext",
//     };
//     console.log(`Could not get holder info results.`);
//     frameContent.frameButtons = [
//         {
//             action: "push",
//             label: "<Home>",
//         },
//     ];
//     return Frame200Response(frameContent);
// }

// GET: /api/holder-graph
// Params:
// idx?
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy') as string
    const idx = req.nextUrl.searchParams.get('idx')
    return await HolderFrame(idx ? +idx : 0, tokenAddy)
}

// POST /api/holders-graph?
// Params:
// idx
// tokenAddy
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const idx = +searchParams.get("idx")!;
    const tokenAddy = searchParams.get("tokenAddy") as string;
    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (data.untrustedData.buttonIndex == 1 && idx == 0) {
        // Case 2: Pressed Back button from page index 0
        const res = await fetch(
            AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 3: Pressed Back button from page index not 0
        return await HolderFrame(idx - 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        return await HolderFrame(idx + 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 5: pressed "home" button
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
        // TODO: Linkout
        // } else if (data.untrustedData.buttonIndex == 4) {
        //     const collection = await zdk.collection({
        //         address: tokenAddy!,
        //         includeFullDetails: true
        //     })
        //     console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
        //     const networkName = collection.networkInfo.network!.toLowerCase()
        //     console.log(`networkName: ${networkName}`)
        //     return new NextResponse(null, {
        //         status: 302,
        //         headers: { Location: `https://zora.co/${networkName}:${tokenAddy}` },
        //       });
    } else {
        // Case 5: Routing error
        const errorMsg = encodeURIComponent(
            "Bad route. Watch this cast to be notified of updates."
        );
        const res = await fetch(
            AppConfig.hostUrl +
                `/api/error?errorMsg=${errorMsg}&tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
}
