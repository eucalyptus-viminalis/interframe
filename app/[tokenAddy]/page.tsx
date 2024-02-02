import { FrameContent } from "@/fc/FrameContent";
import { zdk } from "@/zora/zsk";
import { Chain, Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { Metadata } from "next";
import { getFrameMetadata } from '@coinbase/onchainkit';


const HOST_URL = process.env['HOST'] as string

const frameContent: FrameContent = {
    frameButtonNames: [""],
    frameImageUrl: "",
    framePostUrl: HOST_URL,
    frameTitle: "see Zora",
    frameVersion: "vNext"
}

// Function to convert TypeScript object to URLSearchParams
function objectToSearchParams(obj: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            console.log(obj[key])
            if (obj[key]) {
                params.append(key, encodeURIComponent(obj[key].toString()));
            }
        }
    }
    return params;
}

export type TokenDetails = {
    ca: `0x${string}`
    networkName: "Zora"
    // networkId: 7777777
    name: string | null | undefined
    symbol: string | null | undefined
    mintStatus: "Minting" | "Fully allocated" | null | undefined
    mintPrice?: number | "Unknown"
    totalSupply: number | null | undefined
    description: string | null | undefined
    totalMinted: number | null | undefined
}

export async function generateMetadata(
    { params }: {params: {tokenAddy: string}}
  ): Promise<Metadata> {
   
    const { tokenAddy } = params
    // const tokenInfo = fetch(ZORA_API + '/tokens/' + tokenAddy)

    // Get contract details
    const res = await zdk.collection({
        address: tokenAddy,
        includeFullDetails: false
    })
    console.log(`res: ${JSON.stringify(res, null, 2)}`)
    const { description, name, symbol, totalSupply, networkInfo } = res

    // Get aggregate stats
    const resres = await zdk.collectionStatsAggregate({
        collectionAddress: tokenAddy,
        network: {
            chain: Chain.ZoraMainnet,
            network: Network.Zora
        }
    })

    const nftCount = resres.aggregateStat.nftCount
    console.log(`totalSupply: ${totalSupply}`)
    console.log(`nftCount: ${nftCount}`)

    const mintStatus = !totalSupply
        ? undefined
        : totalSupply - nftCount == 0
            ? "Fully allocated" : "Minting"

    const tokenDetails: TokenDetails = {
        ca: tokenAddy as `0x${string}`,
        name: name,
        symbol: symbol,
        totalMinted: nftCount,
        mintStatus,
        networkName: networkInfo.network as string as "Zora",
        description,
        totalSupply: totalSupply,
    }

    const imgParams = objectToSearchParams(tokenDetails)
    console.log(imgParams.toString())

    frameContent.frameImageUrl = HOST_URL
        + `/api/image/title?ca=${tokenDetails.ca}&name=${name}&symbol=${symbol}&totalMinted=${nftCount}=&mintStatus=${mintStatus}&networkName=${networkInfo.network}&description=${description}&totalSupply=${totalSupply}`
    frameContent.frameButtonNames = ["see Again", "see Latest Mints"]
    frameContent.framePostUrl = HOST_URL + '/'

    const frameMetadata = getFrameMetadata({
        image: frameContent.frameImageUrl,
        buttons: [
            {
                label: 'see Again'
            },
            {
                label: 'see Latest Mints'
            }
        ],
        post_url: frameContent.framePostUrl,
        refresh_period: 60
    })
   
    return {
      title: frameContent.frameTitle,
      openGraph: {
        title: frameContent.frameTitle,
        images: [frameContent.frameImageUrl],
      },
      other: {
        ...frameMetadata
      }
    }
  }

export default async function RootPage({ params }: { params: { tokenAddy: string } }) {
    const {tokenAddy} = params
    return (
        <div>
            <h1>{tokenAddy}</h1>
        </div>
    )

}