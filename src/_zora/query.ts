// Argument defitions

import {
    CollectionQueryArgs,
    CollectionSortKey,
    CollectionsQueryArgs,
    SortDirection,
    TokenQueryArgs,
} from "@zoralabs/zdk";
import { zdk } from "./zsk";
import { Chain, Network, OwnerCountSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";

// where: Parameters that grab a specific set of NFT data, e.g. collectionAddress
// filter: Filters down the results from the where parameters into a smaller data set
// networks: The network and chain to grab NFT data from
// pagination: A way to set the limit and starting point of the response
// sort: Sorts the order of the returned data
// token: An object with a contractAddress and tokenId of a token to look up
// includeFullDetails: An optional bool to get the full token history and information
// includeMarkets: An optional bool to get the on-chain market data for the NFTs

export async function TokenQuery(ca: string, id: string) {
    const args: TokenQueryArgs = {
        token: {
            address: ca,
            tokenId: id,
        },
        includeFullDetails: false,
    };
    const res = await zdk.token(args);
    return res.token;
}

const topHolder = async (tokenAddy: string, rank: number) => {
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
    });
    const owner = owners.aggregateStat.ownersByCount.nodes[rank]
    return owner
};

export async function AggregateStatZora(ca: string) {
    const res = await zdk.collectionStatsAggregate({
        collectionAddress: ca,
        network: {
            chain: Chain.ZoraMainnet,
            network: Network.Zora,
        },
    });
}

export async function CollectionBatchQuery(ca: string[]) {
    const previewArgs: CollectionsQueryArgs = {
        where: {
            collectionAddresses: ca,
        },
        includeFullDetails: false,
        sort: {
            sortDirection: "ASC" as SortDirection,
            sortKey: "CREATED" as CollectionSortKey,
        },
    };
    const previewRes = await zdk.collections(previewArgs);
    return previewRes.collections;
}

export async function CollectionQuery(ca: string, full: boolean) {
    const args: CollectionQueryArgs = {
        address: ca,
        includeFullDetails: full,
    };
    const res = await zdk.collection(args);
    return res;
}
