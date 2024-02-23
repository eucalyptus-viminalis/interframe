import { CurrentRoute } from "@/src/components/CurrentRoute";
import { FrameDiv, Theme } from "@/src/components/FrameDiv";
import TopBar from "@/src/components/TopBar";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const hexColorsEncoded = req.nextUrl.searchParams.get("hexColors");
  const hexColors = hexColorsEncoded
    ? decodeURIComponent(hexColorsEncoded)
    : null;
  const fartoneColorEncoded = req.nextUrl.searchParams.get("fartoneColor");
  const fartoneColor = fartoneColorEncoded
    ? decodeURIComponent(fartoneColorEncoded)
    : null;
  const imageEncoded = req.nextUrl.searchParams.get("image");
  const image = imageEncoded ? decodeURIComponent(imageEncoded) : null;

  const theme: Theme | undefined = hexColors
    ? {
        hexColors: hexColors,
        mode: "dark",
      }
    : undefined;

  // Fonts
  const bold = await fetch(
    new URL("@/assets/RobotoMono-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const mono = await fetch(
    new URL("@/assets/RobotoMono-Regular.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <FrameDiv theme={theme}>
        <TopBar>
          <CurrentRoute pathname="select-theme" />
        </TopBar>
        <div
          id="mid-section"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 50,
            fontFamily: "bold",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>{fartoneColor}</h1>
          {/* {image ? (
            <img
              src={image}
              width={400}
              height={400}
              style={{
                objectFit: "contain",
              }}
            />
          ) : null} */}
        </div>
      </FrameDiv>
    ),
    {
      height: 630,
      width: 1200,
      fonts: [
        {
          data: bold,
          name: "bold",
        },
        {
          data: mono,
          name: "mono",
        },
      ],
      debug: true,
    },
  );
}
