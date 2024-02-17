import { FrameDiv } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
// export const fetchCache = "force-cache";

export async function GET(req: NextRequest) {
    // Fonts
    const barcode = await fetch(
        new URL("@/assets/LibreBarcode128Text-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const mono = await fetch(
        new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Query Params
    const { searchParams } = req.nextUrl;

    // Centre
    const img = searchParams.get("img");

    // Bottom bar
    const tokenId = searchParams.get("tokenId");
    const tokenNameEncoded = searchParams.get("tokenName");
    const tokenName = tokenNameEncoded
        ? decodeURIComponent(tokenNameEncoded)
        : "Unknown";
    const mintTimestampEncoded = searchParams.get("mintTimestamp")!;
    const mintTimestamp = decodeURIComponent(mintTimestampEncoded);
    const mintPrice = searchParams.get("mintPrice");
    const networkName = searchParams.get("networkName");
    const networkId = searchParams.get("networkId");

    // Top bar (Minted by)
    const to = searchParams.get("to");
    const username = searchParams.get("username");
    const pfp = searchParams.get("pfp");
    const ens = searchParams.get("ens");

    const secondaryTextOpacity = 0.35;

    return new ImageResponse(
        (
            <FrameDiv alignItems="flex-start">
                <TopBar>
                    <div
                        id="minted-to"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 64,
                            opacity: secondaryTextOpacity,
                        }}
                    >
                        Minted
                    </div>

                    <div
                        id="minter"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        {pfp ? (
                            <img
                                alt="pfp"
                                width="80"
                                height="80"
                                src={`${pfp}`}
                                style={{
                                    borderRadius: 40,
                                }}
                            />
                        ) : null}

                        {username || ens ? (
                            <span
                                tw="p-1"
                                style={{
                                    fontSize: 50,
                                    opacity: secondaryTextOpacity,
                                }}
                            >
                                {username ? "@" + username : ens}
                            </span>
                        ) : (
                            <span
                                // tw="p-1"
                                style={{
                                    fontSize: 50,
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "200",
                                    wordBreak: "break-all",
                                    textAlign: "right",
                                    opacity: secondaryTextOpacity,
                                }}
                            >
                                {to}
                            </span>
                        )}
                    </div>
                </TopBar>

                <div
                    id="mid-section"
                    style={{
                        // height: "440",
                        width: 1000,
                        display: "flex",
                        fontSize: 42,
                        alignItems: "center",
                        justifyContent: "center",
                        // letterSpacing: '-.08em',
                        gap: 20,
                    }}
                >
                    <div
                        id="token-info"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            justifyContent: "center",
                            alignItems: "center",
                            width: 250,
                            textAlign: "center",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                        }}
                    >
                        {tokenName ? <span>{tokenName}</span> : null}
                        <div>{"#" + tokenId}</div>
                    </div>
                    {img ? (
                        <img
                            id="token-image"
                            alt="tokenImage"
                            height="420"
                            width="700"
                            src={`"${img}"`}
                            style={{
                                opacity: 1,
                                objectFit: "contain",
                            }}
                        />
                    ) : null}
                </div>

                <div
                    id="bottom-bar"
                    style={{
                        height: "15%",
                        width: "100%",
                        display: "flex",
                        fontSize: 88,
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        letterSpacing: "-.08em",
                        gap: 48,
                        opacity: 0.8,
                    }}
                >
                    <span
                        id="mint-timestamp"
                        tw="m-0"
                        style={{
                            fontFamily: '"barcode"',
                        }}
                    >
                        {mintTimestamp ?? "Unknown"}
                    </span>

                    {mintPrice ? (
                        <span
                            id="mint-price"
                            tw="p-2 m-0"
                            style={{
                                fontFamily: '"barcode"',
                            }}
                        >
                            Mint price: {mintPrice}E
                        </span>
                    ) : null}

                    {networkName ? (
                        <span
                            id="network"
                            tw="p-2 m-0"
                            style={{
                                fontFamily: '"barcode"',
                            }}
                        >
                            Network: {networkName}
                        </span>
                    ) : null}
                    <span
                        id="price"
                        tw="p-2 m-0"
                        style={{
                            fontFamily: '"barcode"',
                            width: "30px",
                            height: "100%",
                        }}
                    ></span>
                </div>
            </FrameDiv>
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
                    name: "mono",
                    data: mono,
                    style: "normal",
                },
            ],
            // debug: true,
        }
    );
}
