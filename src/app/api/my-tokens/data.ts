import { zdk } from "@/src/zdk/client"
import { AppConfig } from "../../AppConfig"
import { TokenAddys } from "../../airstack/token-addys/data"

type MyTokensData = {
    token1?: {
        name?: string | null | undefined
        ca: string
    },
    token2?: {
        name?: string | null | undefined
        ca: string
    },
    more: boolean
}

export async function getData(eoas: string, blockchain: string) {
    // Get list of verified accounts
    const res = await fetch(AppConfig.hostUrl + `/airstack/token-addys?eoas=${eoas}&blockchain=${blockchain}`)
    const data: TokenAddys = await res.json()
    const addresses = data.TokenBalances.TokenBalance.map(tb=>tb.tokenAddress)
    const randomAddys = addresses
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    const results = await Promise.all(randomAddys.map(ra => {
        return zdk.collection({address: ra, includeFullDetails: false})
    }))
    const myTokensData: MyTokensData = {
        more: addresses.length > 2,
        // token1,
        // token2,
    }
    if (results[0]) {
        myTokensData.token1 = {
            ca: results[0].address,
            name: results[0].name,
        }
    }
    if (results[1]) {
        myTokensData.token2 = {
            ca: results[0].address,
            name: results[1].name
        }
    }
    return myTokensData
}