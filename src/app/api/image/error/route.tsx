import { CurrentRoute } from "@/src/components/CurrentRoute";
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

    // Query Params
    const { searchParams } = req.nextUrl;

    const tokenAddy = searchParams.get("tokenAddy");
    const msg = searchParams.get("msg");
    const backUrl = searchParams.get("backUrl");

    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    color: "white",
                    alignItems: "center",
                    // letterSpacing: '-.02em',
                    fontWeight: 700,
                    fontSize: 50,
                    // padding: 16,
                    background:
                        "linear-gradient(to bottom right, #343E90, #210446)",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: "mono",
                    opacity: 100,
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
                        height: "12%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        opacity: secondaryTextOpacity,
                    }}
                >
                    <CurrentRoute pathname={req.nextUrl.pathname} />
                    <span
                        tw="p-1"
                        style={{
                            fontSize: 50,
                            opacity: secondaryTextOpacity,
                        }}
                    ></span>
                </div>
                <div
                    id="error-msg"
                    style={{
                        fontSize: 60,
                        margin: 0,
                        padding: 16
                    }}
                >
                    {msg}
                </div>
                <div
                    id="bottom-bar"
                    style={{
                        // height: '15%',
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        // letterSpacing: '-.08em',
                        gap: 48,
                    }}
                >
                    {backUrl ? (
                        <span id="home-btn" tw="p-2 m-0">
                            🔴 back
                        </span>
                    ) : null}
                    <span id="home-btn" tw="p-2 m-0">
                        🟣 home
                    </span>
                    <span
                        id="empty"
                        tw="p-2 m-0"
                        style={{
                            width: "30px",
                            height: "100%",
                        }}
                    ></span>
                </div>
            </div>
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
        }
    );
}
