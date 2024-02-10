import { zdk } from "@/src/zora/zsk";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function GET(req: NextRequest) {
    // Fonts
    const robotoMonoBold = await fetch(
        new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url)
    ).then(res => res.arrayBuffer())
    const robotoMono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then(res => res.arrayBuffer())

    const token1Text = req.nextUrl.searchParams.get('token1Text')!
    const token2Text = req.nextUrl.searchParams.get('token2Text')!

    // Styles
    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <div
                id="frame"
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    color: "white",
                    alignItems: "center",
                    letterSpacing: "-.02em",
                    fontFamily: "robotoMono",
                    fontSize: 50,
                    background:
                        "linear-gradient(to bottom right, #343E90, #210446)",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // textAlign: "center",
                }}
            >
                <div
                    id="top-bar"
                    style={{
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        display: "flex",
                        height: 80,
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
                            opacity: 0.8
                        }}
                    >
                        {"/" + "browse"}
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
                <div
                    id="menu-items"
                    tw=""
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: 'wrap',
                        gap: 50,
                        fontFamily: 'robotoMonoBold',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        id="action-1"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 420,
                            height: 420,
                            borderRadius: '100%',
                            backgroundColor: '#ff0000',
                            textAlign: 'center'
                        }}
                    >
                        {token1Text}
                    </div>
                    <div
                        id="action-1"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 420,
                            height: 420,
                            borderRadius: '100%',
                            backgroundColor: '#0000ff',
                            textAlign: 'center'
                        }}
                    >
                        {token2Text}
                    </div>
                </div>
                <div
                    id="bottom-bar"
                    style={{
                        // height: "15%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // letterSpacing: "-.08em",
                        gap: 32,
                        color: "rgba(255, 255, 255, 0.9)",
                        // opacity: secondaryTextOpacity,
                    }}
                >
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        🟣 Home
                    </div>
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        🟢 random
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 628,
            fonts: [
                {
                    name: "robotoMono",
                    data: robotoMono,
                    style: "normal"
                },
                {
                    name: "robotoMonoBold",
                    data: robotoMonoBold,
                    style: "normal"
                }
            ],
        }
    );
}
