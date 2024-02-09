import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = "edge";
export const fetchCache = 'force-cache'

export async function GET(req: NextRequest) {

  // Fonts
  const barcode = await fetch(
    new URL('@/assets/LibreBarcode128Text-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const roboto = await fetch(
    new URL('@/assets/RobotoMono-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  // Query Params
  const { searchParams } = req.nextUrl

  // Centre
  const img = searchParams.get('img')

  // Bottom bar
  const tokenId = searchParams.get('tokenId')
  const mintTimestamp = searchParams.get('mintTimestamp')
  const mintPrice = searchParams.get('mintPrice')
  const networkName = searchParams.get('networkName')
  const networkId = searchParams.get('networkId')

  // Top bar (Minted by)
  const to = searchParams.get('to')
  const username = searchParams.get('username')
  const pfp = searchParams.get('pfp')
  const ens = searchParams.get('ens')

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
            id="minted-to"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              opacity: secondaryTextOpacity
            }}
          >
            Minted
          </div>

          <div
            id="minter"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >

            {pfp ? (
              <img
                alt="pfp"
                width="64"
                height="64"
                src={`${pfp}`}
                style={{
                  borderRadius: 128,
                }}
              />
            ) : null}

            {username || ens ? (
              <span
                tw="p-1"
                style={{
                  fontSize: 50,
                  opacity: secondaryTextOpacity
                }}
              >
                {username ? '@' + username : ens}
              </span>
            ) : (
              <span
                tw="p-1"
                style={{
                  fontSize: 50,
                  width: '200',
                  wordBreak: 'break-all',
                  opacity: secondaryTextOpacity
                }}
              >
                {to}
              </span>
            )}

          </div>
        </div>

        <div
          id="mid-section"
          style={{
            height: '400',
            width: '100%',
            display: 'flex',
            fontSize: 42,
            alignItems: "center",
            justifyContent: "center",
            // letterSpacing: '-.08em',
            gap: 48
          }}
        >
          <div>
            {'#' + tokenId}
          </div>
          <img
            id="token-image"
            alt="tokenImage"
            height="400"
            src={`${img}`}
            style={{
              opacity: 1
            }}
          />
          {/* <div
          id="token-id"
          tw=""
        >
          {'#' + tokenId}
        </div> */}
        </div>


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
            id="mint-timestamp"
            tw="p-2 m-0"
            style={{
              fontFamily: '"barcode"',

            }}
          >
            At: {mintTimestamp ?? "Unknown"}
          </span>

          {mintPrice ? (
            <span
              id="mint-price"
              tw="p-2 m-0"
              style={{
                fontFamily: '"barcode"'
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
                fontFamily: '"barcode"'
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