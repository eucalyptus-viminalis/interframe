import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function GET(req: NextRequest) {
    // Params
    const token1Text = req.nextUrl.searchParams.get('token1Text')!
    const token2Text = req.nextUrl.searchParams.get('token2Text')!

    // Fonts
    const bold = await fetch(
        new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url)
    ).then(res => res.arrayBuffer())
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then(res => res.arrayBuffer())

    // Styles
    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <FrameDiv>
                <TopBar>
                    <CurrentRoute pathname="my-tokens" />
                </TopBar>
                <div
                    id="menu-items"
                    tw=""
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: 'wrap',
                        gap: 50,
                        fontFamily: 'bold',
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
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word'
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
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word'
                        }}
                    >
                        {token2Text}
                    </div>
                </div>
                <div
                    id="bottom-bar"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        // letterSpacing: "-.08em",
                        gap: 32,
                        color: "rgba(255, 255, 255, 0.9)",
                        // opacity: secondaryTextOpacity,
                    }}
                >
                    <div
                        id="route-1"
                    >
                        {'<back'}
                    </div>
                    <div
                        id="route-1"
                    >
                        🟢 shuffle
                    </div>
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
                    style: "normal"
                },
                {
                    name: "bold",
                    data: bold,
                    style: "normal"
                }
            ],
        }
    );
}
