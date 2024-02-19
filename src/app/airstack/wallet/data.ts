import { fetchQuery, init } from "@airstack/node"
import { AppConfig } from "../../AppConfig"

init(AppConfig.airstackApiKey, 'dev')

export async function getData(eoa: string, blockchain: string) {
    const gql = (eoa: string, blockchain: string) => {
        return `
        query MyQuery {
            Wallet(input: {identity: "${eoa}", blockchain: ${blockchain}}) {
              tokenBalances {
                tokenAddress
              }
            }
          }
        `
    }

    const {data,error} = await fetchQuery(gql(eoa, blockchain))
    if (error) {
        throw new Error(error.message)
    }
    return data
}