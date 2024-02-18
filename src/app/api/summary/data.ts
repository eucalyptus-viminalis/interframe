import { zdk } from "@/src/zdk/client";
import { AppConfig } from "../../AppConfig";
import { Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { TokenBalancesData } from "../../airstack/token-balances/data";

type SummaryImageParams = {
    ca: `0x${string}`;
    networkName: string
    name: string | null | undefined;
    symbol: string | null | undefined;
    mintPrice?: number;
    totalSupply: number | null | undefined;
    description: string | null | undefined;
    totalMinted?: number | null | undefined;
    fcPercentage: string    // to whole integer string
    avgFcFollowerCount: string  // to whole integer string
};

export async function getData(ca: string): Promise<SummaryImageParams> {
    const collection = await zdk.collection({
        address: ca,
        includeFullDetails: false,
    });
    console.log(`collection: ${JSON.stringify(collection, null, 2)}`)
    const blockchain = collection.networkInfo.network.toLowerCase()
    const testApiURL = AppConfig.hostUrl + `/airstack/token-balances?ca=${ca}&blockchain=${blockchain}`
    const airstackRes = await fetch(testApiURL)
    const data: TokenBalancesData = await airstackRes.json()
    console.log(`airstackRes.json(): ${JSON.stringify(data,null,2)}`)
    const tokenBalances = data.TokenBalances.TokenBalance
    console.log(`tokenBalances.length: ${tokenBalances.length}`)
    const filteredTokenBalances = tokenBalances.filter(tb => {
        console.log(`tb: ${JSON.stringify(tb,null,2)}`)
        if (!tb.owner.socials) return false
        return tb.owner.socials.some(s => s.dappName == 'farcaster')
    })
    console.log(`filteredTokenBalances.length: ${filteredTokenBalances.length}`)
    const totalFcFollowers = filteredTokenBalances.reduce((acc, tb) => {
        if (!tb.owner.socials) return acc
        const fcFollowers = tb.owner.socials.reduce((acc2, s) => {
            if (s.dappName != 'farcaster') return acc2
            return acc2 + s.followerCount
        },0)
        return acc + fcFollowers
    }, 0)
    console.log('tokenBalances.length', tokenBalances.length)
    console.log('filteredTokenBalances.length', filteredTokenBalances.length)
    const fcPercentage = (filteredTokenBalances.length / tokenBalances.length) * 100
    const avgFcFollowerCount = (totalFcFollowers / filteredTokenBalances.length)
    return {
            ca: ca as `0x${string}`,
            fcPercentage: fcPercentage.toFixed(0),
            description: collection.description,
            name: collection.name,
            symbol: collection.symbol,
            totalSupply: collection.totalSupply,
            networkName: collection.networkInfo.network,
            avgFcFollowerCount: avgFcFollowerCount.toFixed(0)
        };
}