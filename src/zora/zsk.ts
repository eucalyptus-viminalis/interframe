import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import { NetworkInfo, OwnerCountSortKey, SortDirection } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { AppConfig } from "@/src/app/AppConfig";

// NetworkInfo
const ethMainnet: NetworkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet,
};
const zoraMainnet: NetworkInfo = {
    network: ZDKNetwork.Zora,
    chain: ZDKChain.ZoraMainnet,
};
const baseMainnet: NetworkInfo = {
    network: ZDKNetwork.Base,
    chain: ZDKChain.BaseMainnet,
};
const args = {
    endPoint: AppConfig.zoradGraphql,
    networks: [ethMainnet, zoraMainnet, baseMainnet],
};

export const rankedOwnerByZdk = async (
    tokenAddy: string,
    rank: number,
    networkInfo: NetworkInfo
) => {
    const owners = await zdk.ownersByCount({
        where: {
            collectionAddresses: [tokenAddy.toLowerCase()],
        },
        pagination: {
            limit: 10,
        },
        sort: {
            sortDirection: "DESC" as SortDirection,
            sortKey: "COUNT" as OwnerCountSortKey,
        },
        networks: [networkInfo],
    });
    console.log(`zdk.ownersByCount: ${JSON.stringify(owners, null, 2)}`)
    return owners.aggregateStat.ownersByCount.nodes[rank]
};

export const zdk = new ZDK(args);
