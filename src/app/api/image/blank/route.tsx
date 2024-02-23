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
                    <div
                        id="current-route"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.8,
                        }}
                    >
                    </div>
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
