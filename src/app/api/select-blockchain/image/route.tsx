import { AppConfig } from "@/src/app/AppConfig";
import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv } from "@/src/components/FrameDiv";
import { MyButton } from "@/src/components/MyButton";
import TopBar from "@/src/components/TopBar";
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
            <FrameDiv>
                <TopBar>
                    <CurrentRoute 
                        pathname="select-blockchain" 
                    />
                </TopBar>
                <div
                    id="supported-chains"
                    tw=""
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 50,
                    }}
                >
                    <MyButton id="base-btn" imgSrc={HOST_URL + "/Base_Symbol_Blue.svg"} 
                        buttonHint="base" 
                    />
                    <MyButton id="eth-btn" 
                        imgSrc={HOST_URL + "/eth-diamond-purple.svg"} 
                        buttonHint="eth"
                    />
                    <MyButton id="eth-btn" 
                        imgSrc={HOST_URL + "/Zorb.png"} 
                        buttonHint="zora"
                    />
                </div>
                <div
                    id="bottom-bar" 
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        opacity: secondaryTextOpacity
                    }}
                >
                    <span>{'<back'}</span>
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
            ],
            // debug: true
        }
    );
}
