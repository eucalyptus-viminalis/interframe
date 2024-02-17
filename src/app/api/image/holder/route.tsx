import { FrameDiv } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    // Fonts
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Query Params
    const { searchParams } = req.nextUrl;

    const count = searchParams.get("count");
    const rank = searchParams.get("rank");

    const to = searchParams.get("to");
    const username = searchParams.get("username");
    const pfp = searchParams.get("pfp");
    const ens = searchParams.get("ens");
    const tokenAddy = searchParams.get("tokenAddy");
    const tokenName = searchParams.get("tokenName");

    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <FrameDiv>
                <TopBar>
                    <div
                        id="route-name"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: secondaryTextOpacity,
                            paddingLeft: 10
                        }}
                    >
                        Holder
                    </div>
                    {rank ? (
                        <span
                            // tw="p-1"
                            style={{
                                opacity: secondaryTextOpacity,
                                paddingRight: 10
                            }}
                        >
                            Rank {+rank + 1}
                        </span>
                    ) : null}
                </TopBar>

                <div
                    id="mid-section"
                    style={{
                        height: "400",
                        width: "100%",
                        display: "flex",
                        fontSize: 42,
                        alignItems: "center",
                        justifyContent: "center",
                        // letterSpacing: '-.08em',
                        gap: 48,
                    }}
                >
                    {pfp ? (
                        <div
                            id="fc-user"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <img
                                id="pfp"
                                alt="pfp"
                                height="400"
                                width="400"
                                src={`${pfp}`}
                                style={{
                                    opacity: 1,
                                    borderRadius: "100%",
                                    objectFit: "cover", // Crop the image to cover the specified dimensions
                                    objectPosition: "center", // Center the cropped area within the image container
                                }}
                            />
                            <span>{username}</span>
                        </div>
                    ) : (
                        <span
                            // tw="p-1"
                            style={{
                                fontSize: 50,
                                width: "200",
                                wordBreak: "break-all",
                                opacity: secondaryTextOpacity,
                            }}
                        >
                            {to}
                        </span>
                    )}
                    <div
                        id="token-count"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            width: 420,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            textAlign: 'center'
                        }}
                    >
                        <span
                            style={{
                                fontSize: 80,
                            }}
                        >
                            {count}
                        </span>
                        <span>x</span>
                        {tokenName ? (
                            <span
                                id="token-name"
                                style={{
                                    wordBreak: "break-word",
                                    width: 270,
                                    fontSize: 55
                                }}
                            >
                                {tokenName}
                            </span>
                        ) : (
                            <span
                                id="token-addy"
                                style={{
                                    wordBreak: "break-all",
                                    width: 190,
                                }}
                            >
                                {tokenAddy}
                            </span>
                        )}
                    </div>
                </div>
                <div
                    id="bottom-bar"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        letterSpacing: "-.08em",
                        opacity: secondaryTextOpacity,
                    }}
                >
                    <span
                        id="tokenAddy"
                        tw="m-0"
                        style={{
                            fontFamily: '"roboto"',
                            fontSize: 52,
                        }}
                    >
                        {"/" + tokenAddy}
                    </span>
                </div>
            </FrameDiv>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "mono",
                    data: mono,
                    style: "normal",
                },
            ],
            // debug: true,
        }
    );
}
