import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams

    // Fonts
    const barcode = await fetch(
        new URL('../../../../assets/LibreBarcode128Text-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());
    const roboto = await fetch(
        new URL('../../../../assets/RobotoMono-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());


    // Token details
    const ca = searchParams.get("ca")
    const tokenName = searchParams.get("name")
    const totalMinted = searchParams.get('totalMinted')
    const mintStatus = searchParams.get('mintStatus')
    const networkName = searchParams.get('networkName')
    const mintPrice = searchParams.get('mintPrice')
    // const img = searchParams.get("img");
    const networkId = searchParams.get("networkId");
    const totalSupply = searchParams.get("totalSupply");
    const tokenDescription = searchParams.get("desc")

    // Styles
    const secondaryTextOpacity = 0.35

    // const total = searchParams.get("total");
    // const timestamp = searchParams.get("timestamp");

    return new ImageResponse(
        (
            <div
                id= "frame"
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    color: "white",
                    alignItems: "center",
                    letterSpacing: '-.02em',
                    fontFamily: 'roboto',
                    fontWeight: 700,
                    fontSize: 60,
                    background: "linear-gradient(to bottom right, #343E90, #210446)",
                    flexDirection: "column",
                    justifyContent: "space-between"
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
                        alignItems: 'flex-start',
                        opacity: secondaryTextOpacity
                    }}
                >
                    <div
                        id="contract-address"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 40
                        }}
                    >
                        {'/' + ca}
                    </div>
                    <div
                        id="mint-status"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                        }}
                    >
                    {mintStatus == "Minting" ? (
                        <span
                            tw="m-1"
                            style={{
                                width: '23px',
                                height: '23px',
                                background: '#1BE33B',
                                borderRadius: 100
                            }}
                        />
                    ) : null}
                    {mintStatus ? (
                        <span
                            tw="p-1"
                            style={{
                                fontFamily: '"barcode"',
                                fontSize: 80
                            }}
                        >
                            {mintStatus}
                        </span>
                    ) : null}
                    </div>
                </div>
                <div
                    id="token-name"
                    style={{
                        fontSize: "100px",
                        margin: 0,
                    }}
                >{tokenName}</div>
                <div
                    id="description"
                    tw=""
                    style={{
                        fontSize: '20px'
                    }}
                >{tokenDescription}</div>
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
                        opacity: secondaryTextOpacity
                    }}
                >
                    <span
                        id="total-supply"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"barcode"'
                        }}
                    >Total supply: {totalSupply ?? "Unknown"}</span>
                {mintPrice ? (
                    <span
                        id="mint-price"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"barcode"'
                        }}
                    >Mint price: {mintPrice}E</span>
                ) : null}
                    <span
                        id="network"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"barcode"'
                        }}
                    >
                        Network: {networkName} - {networkId}
                    </span>
                    <span
                        id="safe-area"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"barcode"',
                            width: '30px',
                            height: '100%',

                        }}
                    >
                    </span>


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
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'barcode',
                    data: barcode,
                    style: 'normal',
                },
                {
                    name: 'roboto',
                    data: roboto,
                    style: 'normal',
                }
            ],
        }
    );
}