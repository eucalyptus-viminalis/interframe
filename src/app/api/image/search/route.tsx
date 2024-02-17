import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv } from "@/src/components/FrameDiv";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    // Fonts
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Styles
    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <FrameDiv>
                <div
                    id="top-bar"
                    style={{
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        display: "flex",
                        height: "12%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        // opacity: secondaryTextOpacity,
                    }}
                >
                    <CurrentRoute pathname={req.nextUrl.pathname}/>
                    <div
                        id="blank"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            letterSpacing: "-.035em",
                        }}
                    ></div>
                </div>
                <div>
                    Search for any token.
                </div>
                <div
                    style={{
                        fontSize: 40
                    }} 
                >
                    Supported networks: Base, Ethereum, Zora
                </div>
                <div
                    style={{
                        fontSize: 40
                    }} 
                >
                    Supported token standards: ERC-721, ERC-1155
                </div>
                <div id="bottom-bar"
                    style={{
                        height: 100
                    }} 
                >

                </div>
            </FrameDiv>
        ),
        {
            width: 1200,
            height: 628,
            fonts: [
                {
                    name: "mono",
                    data: mono,
                    style: "normal",
                },
            ],
        }
    );
}
