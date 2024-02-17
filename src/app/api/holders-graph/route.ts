import { NextRequest } from "next/server";
import { AppConfig } from "@/src/app/AppConfig";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { client } from "@/src/neynar/client";
import { FrameContent } from "@/src/fc/FrameContent";
import { Chain } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { FrameButton } from "@/src/fc/FrameButton";
import { GraphCall, eth1155Holder, eth721Holder, rankedOwnerByZdk, zoraRankedHolderByREST } from "./data";
import { zdk } from "@/src/zdk/client";

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
        frameTitle: "holders-graph | interframe",
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
    const networkName = collection.networkInfo.network!.toLowerCase();
    const marketLink = `https://zora.co/${networkName}:${collectionAddress}`;
    // Set frame buttons
    const frameButtons: FrameButton[] =
        idx >= 9
            ? [
                  {
                      action: "post",
                      label: "<back",
                  },
                  {
                      action: "post",
                      label: "<home>",
                  },
                  {
                      action: "link",
                      label: ">market<",
                      target: marketLink,
                  },
              ]
            : [
                  {
                      action: "post",
                      label: "<back",
                  },
                  {
                      action: "post",
                      label: "next>",
                  },
                  {
                      action: "post",
                      label: "<home>",
                  },
                  {
                      action: "link",
                      label: ">market<",
                      target: marketLink,
                  },
              ];
    frameContent.frameButtons = frameButtons
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
        // Try get FC user details
        try {
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
                const errorMsg = encodeURIComponent(
                    "No holder information found. Watch this cast to be notified of updates."
                );
                const res = await fetch(
                    AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`
                );
                return new Response(res.body, {
                    headers: { "Content-Type": "text/html" },
                });
            }
        } catch (error) {
            const errorMsg = encodeURIComponent(
                "No holder information found. Watch this cast to be notified of updates."
            );
            const res = await fetch(
                AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`
            );
            return new Response(res.body, {
                headers: { "Content-Type": "text/html" },
            });
        }
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
                const user = await client.lookupUserByVerification(account.id);
                const username = user.result.user.username;
                const pfp = user.result.user.pfp.url;
                frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
            } catch {
                console.log("Farcaster user not found!");
            }
        } else {
            const errorMsg = encodeURIComponent(
                "No holder information found. Watch this cast to be notified of updates."
            );
            const res = await fetch(
                AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`
            );
            return new Response(res.body, {
                headers: { "Content-Type": "text/html" },
            });
        }
    } else {
        const errorMsg = encodeURIComponent(
            "Unsupported network. Watch this cast to be notified of updates."
        );
        const res = await fetch(
            AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    }
    // TODO: Other interesting stats? Last purchase, last sale? how many minted?
    // Return 200 response with FrameContent
    return Frame200Response(frameContent);
}

// GET: /api/holder-graph
// Params:
// idx?
// tokenAddy
export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get("tokenAddy") as string;
    const idx = req.nextUrl.searchParams.get("idx");
    return await HolderFrame(idx ? +idx : 0, tokenAddy);
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
        // Case 1: Pressed Back button from page index 0
        const res = await fetch(
            AppConfig.hostUrl + `/api/summary?tokenAddy=${tokenAddy}`
        );
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 1) {
        // Case 2: Pressed Back button from page index not 0
        return await HolderFrame(idx - 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 2) {
        // Case 3: Pressed Next button
        return await HolderFrame(idx + 1, tokenAddy);
    } else if (data.untrustedData.buttonIndex == 3) {
        // Case 4: pressed "home" button
        const res = await fetch(AppConfig.hostUrl + `/api/home`);
        return new Response(res.body, {
            headers: { "Content-Type": "text/html" },
        });
    } else if (data.untrustedData.buttonIndex == 4) {
        // Case 5:
        // - link out
        // > No need to handle this as it's handled by Farcaster client with 'link' button
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
