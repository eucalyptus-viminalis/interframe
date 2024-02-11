import { CurrentRoute } from "@/src/components/CurrentRoute";
import { MyFrame } from "@/src/components/MyFrame";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: /api/image/summary
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    // Fonts
    const barcode = await fetch(
        new URL("@/assets/LibreBarcode128Text-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const robotoMonoBold = await fetch(
        new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const robotoMono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Token details
    const ca = searchParams.get("ca");
    const tokenName = searchParams.get("name")
        ? decodeURIComponent(searchParams.get("name")!)
        : "Unknown";
    // const totalMinted = searchParams.get('totalMinted')
    const mintStatus = searchParams.get("mintStatus")
        ? decodeURIComponent(searchParams.get("mintStatus")!)
        : "Unknown";
    const networkName = searchParams.get("networkName");
    const mintPrice = searchParams.get("mintPrice");
    // const img = searchParams.get("img");
    const totalSupply = searchParams.get("totalSupply");
    const tokenDescription = searchParams.get("desc");

    // Styles
    const secondaryTextOpacity = 0.35;

    // const total = searchParams.get("total");
    // const timestamp = searchParams.get("timestamp");

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
                        opacity: secondaryTextOpacity,
                    }}
                >
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
                    {/* <div
                        id="mint-status"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            letterSpacing: "-.035em",
                        }}
                    >
                        {mintStatus == "Minting" ? (
                            <span
                                tw="m-1"
                                style={{
                                    width: "23px",
                                    height: "23px",
                                    background: "#1BE33B",
                                    borderRadius: 100,
                                }}
                            />
                        ) : null}
                        {mintStatus ? (
                            <span
                                tw="p-1"
                                style={{
                                    fontFamily: '"barcode"',
                                    fontSize: 80,
                                }}
                            >
                                {mintStatus}
                            </span>
                        ) : null}
                    </div> */}
                </div>
                <div
                    id="summary-list"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        fontSize: 40,
                        color: "#28E93B",
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
                        🟢 casts
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
            </MyFrame>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "barcode",
                    data: barcode,
                    style: "normal",
                },
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
            // debug: true,
        }
    );
}
