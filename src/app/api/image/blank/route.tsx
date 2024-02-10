import { AppConfig } from "@/src/app/AppConfig";
import { MyButton } from "@/src/components/MyButton";
import { MyFrame } from "@/src/components/MyFrame";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    // Fonts
    const robotoMonoBold = await fetch(
        new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const robotoMono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Styles
    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <MyFrame>
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
            </MyFrame>
        ),
        {
            width: 1200,
            height: 628,
            fonts: [
                {
                    name: "robotoMono",
                    data: robotoMono,
                    style: "normal",
                },
                {
                    name: "robotoMonoBold",
                    data: robotoMonoBold,
                    style: "normal",
                },
            ],
        }
    );
}
