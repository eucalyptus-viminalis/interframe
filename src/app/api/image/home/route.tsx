import { AppConfig } from "@/src/app/AppConfig";
import { MyButton } from "@/src/components/MyButton";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOST_URL = AppConfig.hostUrl;

export async function GET(req: NextRequest) {
    // Fonts
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then(res => res.arrayBuffer())

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
                    fontFamily: "mono",
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
                            opacity: 0.8
                        }}
                    >
                        {"/" + "home"}
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
                    id="supported-chains"
                    tw=""
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 50,
                    }}
                >
                    <MyButton id="base-btn" imgSrc={HOST_URL + "/Base_Symbol_Blue.svg"} />
                    <MyButton id="eth-btn" imgSrc={HOST_URL + "/eth-diamond-purple.svg"} />
                    <MyButton id="eth-btn" imgSrc={HOST_URL + "/Zorb.png"} />
                </div>
                <div
                    id="title"
                    style={{
                        fontSize: 100,
                        margin: 0,
                        // letterSpacing: "0.35em"
                    }}
                >
                    &interframe
                </div>
                <div
                    id="supported-tokens"
                    tw=""
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 50,
                    }}
                >
                    <MyButton id="721-btn" text="721" />
                    <MyButton id="1155-btn" text="1155" />
                    <MyButton id="404-btn" text="404" disabled/>
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
                        opacity: secondaryTextOpacity,
                    }}
                >
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        /home
                    </div>
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        /my-tokens
                    </div>
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        /search
                    </div>
                    <div
                        id="route-1"
                        tw="p-2 m-0"
                        style={{
                        }}
                    >
                        /interframe
                    </div>
                </div>
            </div>
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
            ],
        }
    );
}
