import { fetchQuery, init } from "@airstack/node"
import { AppConfig } from "../../AppConfig"
import { Variables } from "@airstack/node/dist/types/types"

init(AppConfig.airstackApiKey)

type QueryResponse = {
    data: TokenAddysMulti
    error: Error
}

type Error = {
    message: string
}

export type TokenAddysMulti = {
    Ethereum: {
        TokenBalance: TokenBalance[]
    }
    Base: {
        TokenBalance: TokenBalance[]
    }
    Zora: {
        TokenBalance: TokenBalance[]
    }
}
type TokenBalance = {
    tokenAddress: string
}

export async function getData(eoas: string[]) {
    const gql = () => `
    query TokenAddysMulti($eoas: [Identity!]) {
        Ethereum: TokenBalances(
            input: {filter: {owner: {_in: $eoas}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: 70}
          ) {
            TokenBalance {
              tokenAddress
            }
          }
        Base: TokenBalances(
          input: {filter: {owner: {_in: $eoas}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: base, limit: 60}
        ) {
          TokenBalance {
            tokenAddress
          }
        }
        Zora: TokenBalances(
          input: {filter: {owner: {_in: $eoas}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: zora, limit: 70}
        ) {
          TokenBalance {
            tokenAddress
          }
        }
      }
    `
    const vars: Variables = {
        eoas: eoas
    }
    const {data,error}: QueryResponse = await fetchQuery(gql(), vars)
    if (error) {
        throw new Error(error.message)
    }
    return data
}