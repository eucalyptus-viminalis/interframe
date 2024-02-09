import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/_fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/_fc/Frame200Response";
import { rankedOwnerByZdk, zdk } from "@/src/_zora/zsk";
import { client } from "@/src/_neynar/client";
import { FrameContent } from "@/src/_fc/FrameContent";
import { Chain } from "@zoralabs/zdk/dist/queries/queries-sdk";
import {
    GraphCall,
    eth1155Holder,
    eth721Holder,
} from "@/src/the-graph/queries";
import { zoraRankedHolderByREST } from "@/src/_zora/blockscout";

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
                }&date=${Date.now()}`;
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
                }&date=${Date.now()}`;
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
            }&date=${Date.now()}`;
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
            }&date=${Date.now()}`;
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
            // frameContent.frameButtons = [
            //     {
            //         action: "push",
            //         label: "<Home>",
            //     },
            // ];
            // frameContent.frameImageUrl += `/api/image/error?tokenAddy=${collectionAddress}&msg=${errorMsg}`;
            // return Frame200Response(frameContent);
            const errorMsg = "DEBUG: No holder information found.";
            return await fetch(AppConfig.hostUrl + `/api/error?tokenAddy=${collectionAddress}&msg=${errorMsg}`)
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

// POST /api/holders-graph?idx=&tokenAddy=&from=
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const prevIdx = +searchParams.get("idx")!; // Index of top holder idx 0 == top 1 holder
    const tokenAddy = searchParams.get("tokenAddy") as string; // token address `0x${string}`
    const from = searchParams.get("from"); // the previous route where the user came from (e.g. home)

    const data: FrameSignaturePacket = await req.json();

    // Route request
    if (from == "home") {
        // Case 1: Called from /api/home
        // - show top holder
        return await HolderFrame(0, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 1 && prevIdx == 0) {
        // Case 2: Pressed Back button from page index 0
        // - take user to home route
        return await fetch(
            AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`
        );
    } else if (data.untrustedData.buttonIndex == 1 && prevIdx != 0) {
        // Case 3: Pressed Back button from page index not 0
        // - show previous page
        return await HolderFrame(prevIdx - 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 4: Pressed Next button
        // - show next page
        // Note: Next button is not shown at LAST_INDEX
        return await HolderFrame(prevIdx + 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 5: Pressed Home button
        // - take user to home route
        return await fetch(
            AppConfig.hostUrl + `/api/home?tokenAddy=${tokenAddy}`
        );
    } else if (data.untrustedData.buttonIndex == 4) {
        // TODO: Redirect user to external site
        const collection = await zdk.collection({
            address: tokenAddy!,
            includeFullDetails: true,
        });
        console.log(`collection: ${JSON.stringify(collection, null, 2)}`);
        const networkName = collection.networkInfo.network!.toLowerCase();
        console.log(`networkName: ${networkName}`);
        return new NextResponse(null, {
            status: 302,
            headers: {
                Location: `https://zora.co/${networkName}:${tokenAddy}`,
            },
        });
    } else {
        console.log(`FIXME: routing options not found for ${req.nextUrl}`);
        return new Response();
    }
    // Case 5: Pressed redirect to Zora button
}

export async function GET(req: NextRequest) {
    console.log("GET /api/mint");
    return new Response();
}
