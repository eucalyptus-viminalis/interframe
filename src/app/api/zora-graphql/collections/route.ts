import { AppConfig } from "@/src/app/AppConfig";
import { NextRequest } from "next/server";
import "@/src/utils/ethereum-address"
import { Collection, NetworkInfo, TokenStandard } from "@zoralabs/zdk/dist/queries/queries-sdk";

const gqlRequestInit = (query: string): RequestInit => {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };
};


// type ZoraGQLCollection = {
//     address: string,
//     description: string,
//     name?: string
//     symbol?: string
//     totalSupply?: number
//     networkInfo: NetworkInfo,
//     tokenStandard: "ERC721" | "ERC1155"     // TokenStandard
//     // attributes?: CollectionAttribute[]
// }

export type CollectionsData = {
    collections: {
        nodes: Collection[]
    }
}

export async function GET(req: NextRequest) {
    const tokenAddy = req.nextUrl.searchParams.get('tokenAddy')
    // Handle bad requests
    if (!tokenAddy) {
        return new Response("Missing 'tokenAddy' parameter", { status: 400 })
    } else if (!tokenAddy.isValidEthereumAddress()) {
        return new Response("Invalid 'tokenAddy' parameter. Must be a 0x address.", { status: 400 })
    }
    const res = await fetch(AppConfig.zoraGraphql, gqlRequestInit(gql(tokenAddy)))
    const { data }: {data: CollectionsData} = await res.json()
    if (data.collections.nodes.length == 0) {
        return new Response("Collection not found", { status: 404 })
    }
    return new Response(JSON.stringify(data.collections.nodes[0]), {headers: {'Content-Type': 'application/json'}})
}

const gql = (tokenAddy: string) => `
query MyQuery {
    collections(
      where: {collectionAddresses: "${tokenAddy}"}
      pagination: {limit: 10}
      networks: [{network: BASE, chain: BASE_MAINNET}, {network: ZORA, chain: ZORA_MAINNET}, {network: ETHEREUM, chain: MAINNET}]
    ) {
      nodes {
        description
        name
        symbol
        networkInfo {
          chain
          network
        }
        tokenStandard
        totalSupply
        address
      }
    }
  }
`