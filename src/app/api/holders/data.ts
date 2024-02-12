import { zdk } from "@/src/zora/zsk";
import { AppConfig } from "../../AppConfig";
import { SortDirection } from "@zoralabs/zdk";
import {
    Chain,
    Collection,
    OwnerCountSortKey,
    TokenStandard,
} from "@zoralabs/zdk/dist/queries/queries-sdk";

type HolderData = {
    ownerAddress: string;
    count: number;
    tokenStandard: string;
    networkName: string;
    numHolders: number;
    // TODO: Other interesting stats? Last purchase, last sale? how many minted?
};

export async function getHolderData(
    tokenAddy: string,
    rank: number
): Promise<HolderData> {
    const collection = await getCollection(tokenAddy);
    if (!collection) {
        throw new Error("Collection information not found.");
    }
    // Switch on ERC type
    if (collection.tokenStandard == TokenStandard.Erc721) {
        // Use ZDK
        const [topHolders, ownerCount] = await Promise.all([
            zdk.ownersByCount({
                pagination: {
                    limit: 10,
                    // after:
                },
                where: {
                    collectionAddresses: [tokenAddy],
                    // attributes: ,
                    // tokens: ,
                },
                // networks: [],
                sort: {
                    sortDirection: "DESC" as SortDirection,
                    sortKey: "COUNT" as OwnerCountSortKey,
                },
            }),
            zdk.ownerCount({
                where: {
                    collectionAddresses: [tokenAddy],
                },
                networks: zdk.defaultNetworks,
            }),
        ]);
        // return topHolders.aggregateStat.ownersByCount.nodes[rank];
        return {
            ownerAddress:
                topHolders.aggregateStat.ownersByCount.nodes[rank].owner,
            count: topHolders.aggregateStat.ownersByCount.nodes[rank].count,
            networkName: collection.networkInfo.network,
            tokenStandard: collection.tokenStandard,
            numHolders: ownerCount.aggregateStat.ownerCount,
        };
    } else if (collection.tokenStandard == TokenStandard.Erc1155) {
        console.log('ERC1155 Detected...')
        // Use The Graph
        // Switch on Network type
        if (collection.networkInfo.chain == Chain.ZoraMainnet) {
            // Zora 1155
            const { count, holderAddress, totalHolders } =
                await holderByZoraREST(tokenAddy, rank);
            return {
                ownerAddress: holderAddress,
                count: count,
                networkName: collection.networkInfo.network,
                tokenStandard: collection.tokenStandard,
                numHolders: totalHolders,
            };
        } else if (collection.networkInfo.chain == Chain.BaseMainnet) {
            // Base 1155
            const data = await holderByBase1155Subgraph(tokenAddy, rank);
            return {
                ownerAddress: data.address,
                count: data.count,
                networkName: collection.networkInfo.network,
                tokenStandard: collection.tokenStandard,
                numHolders: data.numHolders,
            };
        } else if (collection.networkInfo.chain == Chain.Mainnet) {
            // ETH 1155
            console.log('ETH1155 detected...')
            const data = await holderByEth1155Subgraph(tokenAddy, rank);
            return {
                ownerAddress: data.address,
                count: +data.count,
                networkName: collection.networkInfo.network,
                tokenStandard: collection.tokenStandard,
                numHolders: data.numHolders,
            };
        } else {
            throw new Error(
                `Unsupported network: ${collection.networkInfo.network}`
            );
        }
    } else {
        throw new Error(
            `Unsupported token standard: ${collection.tokenStandard}`
        );
    }
}

async function getCollection(tokenAddy: string) {
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
`;

    const res = await fetch(AppConfig.zoraGraphql, {
        body: JSON.stringify({ query: gql(tokenAddy) }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const { data }: { data: {
        collections: {
            nodes: Collection[]
        }
    } } = await res.json();
    console.log(`zoraGraphql: ${JSON.stringify(data, null ,2)}`)
    return data.collections.nodes[0];
}

// for Zora 721s & 1155s
const holderByZoraREST = async (tokenAddy: string, rank: number) => {
    const res = await fetch(
        AppConfig.zoraRestUrl +
            "/tokens/" +
            tokenAddy.toLowerCase() +
            "/holders"
    );
    const { items }: { items: BlockscoutHolder[] } = await res.json();
    // Calculate total number of tokens by address
    const totalPerAddress = items.reduce<
        { addressHash: string; totalCount: number }[]
    >((acc, holder) => {
        const addressHash = holder.address.hash;
        const existingHolder = acc.find(
            (item) => item.addressHash === addressHash
        );
        if (existingHolder) {
            existingHolder.totalCount += parseInt(holder.value); // Assuming "value" is a string representation of a number
        } else {
            acc.push({
                addressHash,
                totalCount: parseInt(holder.value),
            });
        }
        return acc;
    }, []);
    // Case 1: No holders found
    if (totalPerAddress.length == 0) {
        throw new Error("No holders found.");
    }
    // Case 2: Holder count smaller than rank
    if (rank >= totalPerAddress.length) {
        throw new Error("Less holders than specified rank.");
    }

    // Sort the totals by total value in descending order
    totalPerAddress.sort((a, b) => b.totalCount - a.totalCount);

    // Get the nth top holder
    const rankedTopHolder = totalPerAddress[rank];
    console.log(`rankedTopHolder: ${JSON.stringify(rankedTopHolder, null, 2)}`);
    return {
        holderAddress: rankedTopHolder.addressHash,
        count: rankedTopHolder.totalCount,
        totalHolders: totalPerAddress.length,
    };
};

type BlockscoutHolder = {
    address: {
        ens_domain_name: string | null;
        hash: string;
    };
    token: {
        address: string; // token contract address
        holders: string; // number of holders
        icon_url: string | null;
        name: string;
        symbol: string | null;
        total_supply: string | null;
        type: string | "ERC-1155";
    };
    token_id: string; // common for erc-1155 to have multiple tokens with same token_id
    value: string; // number of tokens (with token_id) held
};

type BASE1155Collection = {
    collection?: {
        collectionHoldings: {
            balance: string;
            account: {
                id: string;
            };
        }[];
    };
};

async function holderByBase1155Subgraph(tokenAddy: string, rank: number) {
    const gql = (tokenAddy: string) => {
        return `
        {
            collection(id: "${tokenAddy.toLowerCase()}") {
              collectionHoldings(first: 10, orderBy: balance, orderDirection: desc) {
                balance
                id
                account {
                  id
                }
              }
              name
              symbol
            }
          }
        `;
    };
    const res = await fetch(
        AppConfig.theGraphUrl +
            "/" +
            AppConfig.theGraphApiKey +
            "/subgraphs/id/9LyYqhj7LqDaivsifyeYF7ERqtmisnzXWm2799qo7Xfq",
        {
            body: JSON.stringify({ query: gql(tokenAddy) }),
            method: "post",
            headers: { "Content-Type": "application/json" },
        }
    );
    const { data }: { data: BASE1155Collection } = await res.json();
    if (!data.collection) {
        throw new Error("The Graph API failed.");
    }
    if (rank >= data.collection.collectionHoldings.length) {
        throw new Error("Less holders than specified rank.");
    }
    return {
        address: data.collection.collectionHoldings[rank].account.id,
        count: parseInt(data.collection.collectionHoldings[rank].balance),
        numHolders: data.collection.collectionHoldings.length,
    };
}

type ETH1155Collection = {
    collection?: {
        collectionHoldings: {
            balance: string;
            account: {
                id: string;
            };
        }[];
    };
};

async function holderByEth1155Subgraph(tokenAddy: string, rank: number) {
    const gql = (tokenAddy: string) => {
        return `
        {
            collection(id: "${tokenAddy.toLowerCase()}") {
              collectionHoldings(first: 10, orderBy: balance, orderDirection: desc) {
                balance
                account {
                  id
                }
              }
            }
        }
        `;
    };
    const subgraphUrl =
        AppConfig.theGraphUrl +
        "/" +
        AppConfig.theGraphApiKey +
        "/subgraphs/id/5C6JRVzKcE9AVbT7S71EycV8eEGcfkJB9gGsyTbHMVmN";
    const res = await fetch(subgraphUrl, {
        body: JSON.stringify({ query: gql(tokenAddy) }),
        method: "post",
        headers: { "Content-Type": "application/json" },
    });
    const { data }: { data: ETH1155Collection } = await res.json();
    if (!data.collection) {
        throw new Error("The Graph API failed.");
    }
    if (rank >= data.collection.collectionHoldings.length) {
        throw new Error("Less holders than specified rank.");
    }
    return {
        address: data.collection.collectionHoldings[rank].account.id,
        count: parseInt(data.collection.collectionHoldings[rank].balance),
        numHolders: data.collection.collectionHoldings.length,
    };
}
