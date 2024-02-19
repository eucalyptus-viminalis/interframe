import { fetchQuery, init } from "@airstack/node"
import { AppConfig } from "../../AppConfig"
import { Variables } from "@airstack/node/dist/types/types"

init(AppConfig.airstackApiKey)

type QueryResponse = {
    data: TokenAddys
    error: Error
}

type Error = {
    message: string
}

export type TokenAddys = {
    TokenBalances: {
        TokenBalance: TokenBalance[]
    }
}
type TokenBalance = {
    tokenAddress: string
}

export async function getData(eoas: string[], blockchain: string) {
    const gql = () => `
    query TokenAddysMulti($eoas: [Identity!]) {
        TokenBalances(
            input: {filter: {owner: {_in: $eoas}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: $blockchain, limit: 70}
          ) {
            TokenBalance {
              tokenAddress
            }
          }
      }
    `
    const vars: Variables = {
        eoas: eoas,
        blockchain: blockchain
    }
    const {data,error}: QueryResponse = await fetchQuery(gql(), vars)
    if (error) {
        throw new Error(error.message)
    }
    return data
}