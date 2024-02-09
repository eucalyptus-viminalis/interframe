import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = "edge";

export async function GET(req: NextRequest) {

    // Fonts
    const roboto = await fetch(
        new URL('@/assets/RobotoMono-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    // Query Params
    const { searchParams } = req.nextUrl

    const tokenAddy = searchParams.get('tokenAddy')
    const msg = searchParams.get('msg')

    const secondaryTextOpacity = 0.35

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
                    fontSize: 60,
                    // padding: 16,
                    background: "linear-gradient(to bottom right, #343E90, #210446)",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: 'roboto',
                    opacity: 1
                    // textAlign: "center",
                }}
            >
                <div
                    id="top-bar"
                    style={{
                        padding: 0,
                        margin: 0,
                        width: '100%',
                        display: "flex",
                        height: "12%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: 'flex-start'
                    }}
                >
                    <div
                        id="route-name"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 64,
                            opacity: secondaryTextOpacity
                        }}
                    >
                        Error
                    </div>
                    <span
                        tw="p-1"
                        style={{
                            fontSize: 50,
                            opacity: secondaryTextOpacity
                        }}
                    >
                    </span>

                </div>
                <div
                    id="token-name"
                    style={{
                        fontSize: "100px",
                        margin: 0,
                    }}
                >{msg}</div>
                <div
                    id="bottom-bar"
                    style={{
                        height: '15%',
                        width: '100%',
                        display: 'flex',
                        fontSize: 88,
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        letterSpacing: '-.08em',
                        gap: 48,
                        opacity: 0.3
                    }}
                >
                    <span
                        id="tokenAddy"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"roboto"',

                        }}
                    >
                        {'/' + tokenAddy}
                    </span>
                    <span
                        id="empty"
                        tw="p-2 m-0"
                        style={{
                            width: '30px',
                            height: '100%',
                        }}
                    >
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'roboto',
                    data: roboto,
                    style: 'normal',
                }
            ],
        }
    );
}