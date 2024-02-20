import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export async function GET(req: NextRequest) {
  // Params
  const backBtnEncoded = req.nextUrl.searchParams.get("backBtn")!;
  const backBtn = decodeURIComponent(backBtnEncoded);
  const moreBtn = req.nextUrl.searchParams.get("moreBtn");
  const token1NameEncoded = req.nextUrl.searchParams.get("token1Name");
  const token1Name = token1NameEncoded
    ? decodeURIComponent(token1NameEncoded)
    : null;
  const token1Addy = req.nextUrl.searchParams.get("token1Addy");
  const token1Blockchain = req.nextUrl.searchParams.get("token1Blockchain");
  const token1TypeEncoded = req.nextUrl.searchParams.get("token1Type");
  const token1Type = token1TypeEncoded
    ? decodeURIComponent(token1TypeEncoded)
    : null;
  const token1TotalSupply = req.nextUrl.searchParams.get("token1TotalSupply");
  const token1LogoEncoded = req.nextUrl.searchParams.get("token1Logo");
  const token1Logo = token1LogoEncoded
    ? decodeURIComponent(token1LogoEncoded)
    : null;
  const token1Idx = req.nextUrl.searchParams.get("token1Idx");

  const token2NameEncoded = req.nextUrl.searchParams.get("token2Name");
  const token2Name = token2NameEncoded
    ? decodeURIComponent(token2NameEncoded)
    : null;
  const token2Addy = req.nextUrl.searchParams.get("token2Addy");
  const token2Blockchain = req.nextUrl.searchParams.get("token2Blockchain");
  const token2TypeEncoded = req.nextUrl.searchParams.get("token2Type");
  const token2Type = token2TypeEncoded
    ? decodeURIComponent(token2TypeEncoded)
    : null;
  const token2TotalSupply = req.nextUrl.searchParams.get("token2TotalSupply");
  const token2LogoEncoded = req.nextUrl.searchParams.get("token2Logo");
  const token2Logo = token2LogoEncoded
    ? decodeURIComponent(token2LogoEncoded)
    : null;
  const token2Idx = req.nextUrl.searchParams.get("token2Idx");

  // Fonts
  const bold = await fetch(
    new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const mono = await fetch(
    new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  // Styles
  const secondaryTextOpacity = 0.35;

  return new ImageResponse(
    (
      <FrameDiv>
        <TopBar>
          <CurrentRoute pathname="search/results" />
        </TopBar>
        <div
          id="results"
          // tw=""
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            // fontFamily: "bold",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {token1Addy ? (
            <div
              id="result-1"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: 580,
                height: 420,
                border: "white 5px solid",
                padding: 16,
                // borderRadius: "100%",
                // backgroundColor: "#ff0000",
                textAlign: "left",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -10,
                  transform: "translate(-50%, 100%)",
                }}
              >
                {token1Idx}
              </span>
              {/* {token1Logo ? (
              <img src={token1Logo} width={100} height={100} />
            ) : null} */}
              {token1Name ? <span>{"name: " + token1Name}</span> : null}
              {token1Blockchain ? (
                <span>{"chain: " + token1Blockchain}</span>
              ) : null}
              {token1Type ? <span>{"type: " + token1Type}</span> : null}
              {token1TotalSupply ? (
                <span>{"total supply: " + token1TotalSupply}</span>
              ) : null}
              {token1Addy ? (
                <span style={{ fontSize: 40 }}>{"ca: " + token1Addy}</span>
              ) : null}
            </div>
          ) : (
            <span>Not results found.</span>
          )}
          <div
            id="result-2"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: 580,
              height: 420,
              border: "white 5px solid",
              padding: 16,
              // borderRadius: "100%",
              // backgroundColor: "#ff0000",
              textAlign: "left",
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                bottom: -10,
                transform: "translate(-50%, 100%)",
              }}
            >
              {token2Idx}
            </span>
            {/* {token1Logo ? (
              <img src={token1Logo} width={100} height={100} />
            ) : null} */}
            {token2Name ? <span>{"name: " + token2Name}</span> : null}
            {token2Blockchain ? (
              <span>{"chain: " + token2Blockchain}</span>
            ) : null}
            {token2Type ? <span>{"type: " + token2Type}</span> : null}
            {token2TotalSupply ? (
              <span>{"total supply: " + token2TotalSupply}</span>
            ) : null}
            {token2Addy ? (
              <span style={{ fontSize: 40 }}>{"ca: " + token2Addy}</span>
            ) : null}
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
          <div id="back">{backBtn}</div>
          {moreBtn ? <div id="more">{moreBtn}</div> : null}
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
          style: "normal",
        },
        {
          name: "bold",
          data: bold,
          style: "normal",
        },
      ],
      // debug: true,
    },
  );
}
