import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: /api/image/summary
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    // Fonts
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Token details
    const ca = searchParams.get("ca");
    const tokenName = searchParams.get("name")
        ? decodeURIComponent(searchParams.get("name")!)
        : "Unknown token name";
    // const totalMinted = searchParams.get('totalMinted')
    const mintStatus = searchParams.get("mintStatus")
        ? decodeURIComponent(searchParams.get("mintStatus")!)
        : "Unknown mint status";
    const networkName = searchParams.get("networkName");
    const mintPrice = searchParams.get("mintPrice");
    const fcPercentage = searchParams.get("fcPercentage");
    const avgFcFollowerCount = searchParams.get("avgFcFollowerCount");
    // const img = searchParams.get("img");
    const totalSupply = searchParams.get("totalSupply");
    const tokenDescription = searchParams.get("desc");

    // Styles
    const secondaryTextOpacity = 0.35;

    // const total = searchParams.get("total");
    // const timestamp = searchParams.get("timestamp");

    return new ImageResponse(
        (
            <FrameDiv>
                <TopBar>
                    <CurrentRoute pathname={req.nextUrl.pathname} />
                    <span
                        id="token-name"
                        style={{
                            display: "flex",
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            opacity: 100,
                        }}
                    >
                        {tokenName}
                    </span>
                </TopBar>
                <div
                    id="summary-list"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: 'space-around',
                        width: "92%",
                        height: '70%',
                        fontSize: 40,
                        color: "#28E93B",
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        gap: 20,
                        padding: 20,
                    }}
                >
                    {tokenDescription ? (
                        <span>Description: {tokenDescription}</span>
                    ) : null}
                    {totalSupply ? (
                        <span>Total supply: {totalSupply}</span>
                    ) : null}
                    {mintPrice ? <span>Mint price: {mintPrice}</span> : null}
                    {networkName ? <span>Network: {networkName}</span> : null}
                    {fcPercentage ? <span>% of FC holders: {fcPercentage}%</span> : null}
                    {avgFcFollowerCount ? <span>Avg. followers per FC holder: {avgFcFollowerCount}</span> : null}
                    {ca ? <span>CA: {ca}</span> : null}
                </div>
                <div
                    id="bottom-bar"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        // letterSpacing: "-.08em",
                        gap: 8,
                        letterSpacing: -6,
                        wordSpacing: "-30px",
                        color: "rgba(255, 255, 255, 0.9)",
                        // opacity: secondaryTextOpacity,
                    }}
                >
                    <div id="route-1" tw="p-2 m-0" style={{}}>
                        🟣 Home
                    </div>
                    {/* <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 200,
                            height: 200,
                            borderRadius: "100%",
                            backgroundColor: "#ff0000",
                            textAlign: "center",
                        }}
                    >
                        latest mints
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 200,
                            height: 200,
                            borderRadius: "100%",
                            backgroundColor: "#0000ff",
                            textAlign: "center",
                        }}
                    >
                        top holders
                    </div> */}
                    <div id="route-2" tw="p-2 m-0" style={{}}>
                        🔴 latest mints
                    </div>
                    <div id="route-3" tw="p-2 m-0" style={{}}>
                        🔵 top holders
                    </div>
                    <div id="route-4" tw="p-2 m-0" style={{}}>
                        🟢 market
                    </div>
                </div>

                {/* <img
        alt="img"
        height="600"
        src={`${img}`}
        style={{
            maxHeight: '600px',  // Set your desired maximum height
            maxWidth: '800px',   // Set your desired maximum width
            // borderRadius: 128,
        }}
    /> */}
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
