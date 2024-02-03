import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function GET(req: NextRequest) {
    const {searchParams} = req.nextUrl
    const id = searchParams.get('id')
    const addy = searchParams.get('addy')
    const tokenImgUrl = searchParams.get('tokenImgUrl')
    const ens = searchParams.get('ens')

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3>#{id}</h3>
        <img
          alt="avatar"
          width="256"
          src={`${tokenImgUrl}`}
          style={{
            borderRadius: 128,
          }}
        />
        <p tw='border-2 border-black p-2 mx-4'>minted by: {ens == null ? ens : addy}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}