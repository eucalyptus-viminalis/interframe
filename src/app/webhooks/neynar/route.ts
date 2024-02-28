import { NextRequest } from "next/server";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { client } from "@/src/neynar/client";
import { AppConfig } from "../../AppConfig";

type NeynarWebhookData = {
    object: string | "cast";
    hash: string;
    thread_hash: string; // same as hash if root cast
    parent_hash: string | null; // null if root cast
    parent_url: string | null; // warpcast channel URL if root cast in channel, otherwise null
    root_parent_url: string; // carpcast channel URL if reply to channel cast
    parent_author: {
        fid: string | null;
    };
    author: {
        object: string | "user";
        fid: number;
        custody_address: string;
        username: string;
        display_name: string;
        pfp_url: string;
        profile: {
            bio: {
                text: string;
                mentioned_profiles: string[] | [];
            };
        };
        follower_count: number;
        following_count: number;
        verifications: string[];
        active_status: string | "active";
    };
    text: string; // the cast's text content
    timestamp: string; // datetime string. e.g. "2024-02-23T02:29:18.000Z"
    embeds: Embed[] | [];
    reactions: {
        likes: [];
        recasts: [];
    };
    replies: {
        count: number;
    };
    mentioned_profiles: User;
};

type Embed = {
    url: string;
};

type NeynarWebhookPayload = {
    created_at: number; // unix time
    type: string | "cast.created"; // webhook type
    data: NeynarWebhookData; // slightly different shape to node sdk Cast type
};

export async function POST(req: NextRequest) {
    const payload: NeynarWebhookPayload = await req.json();
    console.log("web hook request received.", JSON.stringify(payload));

    const { created_at, data, type } = payload;
    // Check that text contains token and reply to the cast with interframe frame URL
    if (data.text.toLowerCase().includes("token")) {
        // Grab parent cast
        if (data.parent_hash) {
            const parent_cast = await client.lookUpCastByHash(data.parent_hash);
            // Check for embeds
            if (parent_cast.result.cast.embeds) {
                const zoraEmbeds = parent_cast.result.cast.embeds
                    .filter((e) => {
                        console.log("e", JSON.stringify(e));
                        console.log("e.url", JSON.stringify(e.url));
                        return e.url && e.url.includes("zora.co");
                    })
                    .map((e) => e.url)
                    .join();
                const mintFunEmbeds = parent_cast.result.cast.embeds
                    .filter((e) => {
                        console.log("e", JSON.stringify(e));
                        console.log("e.url", JSON.stringify(e.url));
                        return e.url && e.url.includes("mint.fun");
                    })
                    .map((e) => e.url)
                    .join();
                const memeMarketEmbeds = parent_cast.result.cast.embeds
                    .filter((e) => {
                        console.log("e", JSON.stringify(e));
                        console.log("e.url", JSON.stringify(e.url));
                        return e.url && e.url.includes("meme.market");
                    })
                    .map((e) => e.url)
                    .join();
                console.log("zoraEmbeds", zoraEmbeds);
                console.log("mintFunEmbeds", zoraEmbeds);
                console.log("mintMarketEmbeds", zoraEmbeds);
                if (zoraEmbeds) {
                    // Regular expression to match any prefix followed by a 0x string
                    const regex = /(?:zora|eth|base):(?:0x[a-fA-F0-9]{40})/;

                    // Execute the regular expression on the URL
                    const match = zoraEmbeds.match(regex);

                    // Check if a match is found
                    if (match) {
                        // Extract the entire matched string
                        const fullMatch = match[0];
                        console.log(fullMatch); // Output: zora:0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf
                        // Extract the 0x string from the matched group
                        const hexString = fullMatch.split(":")[1];
                        console.log(hexString); // Output: 0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf
                        // Publish cast
                        const castText = `revealing token`;
                        const frameUrl = `https://interframe-eight.vercel.app/api/summary?tokenAddy=${hexString}`;
                        client.publishCast(AppConfig.botSignerUUID, castText, {
                            replyTo: data.hash,
                            embeds: [
                                {
                                    url: frameUrl,
                                },
                            ],
                        });
                    } else {
                        console.log("No matching pattern found in the URL.");
                    }
                } else if (mintFunEmbeds) {
                    // Regular expression to match any prefix followed by a 0x string
                    const regex = /(?:zora|eth|base)\/(?:0x[a-fA-F0-9]{40})/;

                    // Execute the regular expression on the URL
                    const match = mintFunEmbeds.match(regex);

                    // Check if a match is found
                    if (match) {
                        // Extract the entire matched string
                        const fullMatch = match[0];
                        console.log(fullMatch); // Output: zora:0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf
                        // Extract the 0x string from the matched group
                        const hexString = fullMatch.split("/")[1];
                        console.log(hexString); // Output: 0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf
                        // Publish cast
                        const castText = `revealing token`;
                        const frameUrl = `https://interframe-eight.vercel.app/api/summary?tokenAddy=${hexString}`;
                        client.publishCast(AppConfig.botSignerUUID, castText, {
                            replyTo: data.hash,
                            embeds: [
                                {
                                    url: frameUrl,
                                },
                            ],
                        });
                    } else {
                        console.log("No matching pattern found in the URL.");
                    }
                } else if (memeMarketEmbeds) {
                    // Regular expression to match any prefix followed by a 0x string
                    const regex = /(?:0x[a-fA-F0-9]{40})/;

                    // Execute the regular expression on the URL
                    const match = mintFunEmbeds.match(regex);

                    // Check if a match is found
                    if (match) {
                        // Extract the entire matched string
                        const fullMatch = match[0];
                        const hexString = fullMatch;
                        console.log(hexString); // Output: 0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf
                        // Publish cast
                        const castText = `revealing token`;
                        const frameUrl = `https://interframe-eight.vercel.app/api/summary?tokenAddy=${hexString}`;
                        client.publishCast(AppConfig.botSignerUUID, castText, {
                            replyTo: data.hash,
                            embeds: [
                                {
                                    url: frameUrl,
                                },
                            ],
                        });
                    } else {
                        console.log("No matching pattern found in the URL.");
                    }
                }
            }
        }
    } else {
        console.log('payload.data.text did not include "token"');
    }

    return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
    });
}
