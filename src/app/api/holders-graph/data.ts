import { AppConfig } from "@/src/app/AppConfig";
import { zdk } from "@/src/zdk/client";
import { NetworkInfo, OwnerCountSortKey, SortDirection } from "@zoralabs/zdk/dist/queries/queries-sdk";

export const GraphQuery = {
    base1155TopHolder: (tokenAddy: string, rank: number) => {
        return `
        {
            collection(id: "${tokenAddy.toLowerCase()}") {
              collectionHoldings(first: 1, skip: ${rank}, orderBy: balance, orderDirection: desc) {
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
        `
    },
    base721TopHolder: (tokenAddy: string, rank: number) => {
        return `
        {
        collection(id: "${tokenAddy.toLowerCase()}") {
          holdings(first: 1, skip: ${rank}, orderDirection: desc, orderBy: tokenCount) {
            tokenCount
            account {
              id
            }
          }
        }
        `;
    },
    eth721TopHolder: (tokenAddy: string, rank: number) => {
        return `
        {
            collection(id: "${tokenAddy}" subgraphError: allow) {
              holdings(first: 1, skip: ${rank}, orderBy: tokenCount, orderDirection: desc) {
                account {
                  id
                }
                tokenCount
              }
            }
        }
        `;
    },
    eth1155TopHolder: (tokenAddy: string, rank: number) => {
        return `
        {
            collection(id: "${tokenAddy.toLowerCase()}") {
              collectionHoldings(first: 1, orderBy: balance, orderDirection: desc, skip: ${rank}) {
                balance
                account {
                  id
                }
              }
            }
        }
        `;
    },
};

const optionsWithQuery = (query: string) => {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };
};

type BASE721Collection = {
    collection?: {
        holdings: {
            tokenCount: string;
            account: {
                id: string;
            };
        }[];
    };
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

export const GraphCall = {
    base721: async (tokenAddy: string, rank: number) => {
        const query = GraphQuery.base721TopHolder(tokenAddy, rank);
        const res = await fetch(AppConfig.theGraph.base721subgraph, optionsWithQuery(query));
        const { data }: { data: BASE721Collection } = await res.json();
        console.log(`721: ${JSON.stringify(data, null, 2)}`);
        return data.collection?.holdings[0] ?? null;
    },
    base1155: async (tokenAddy: string, rank: number) => {
        const query = GraphQuery.base1155TopHolder(tokenAddy, rank);
        const res = await fetch(AppConfig.theGraph.base1155subgraph, optionsWithQuery(query));
        const { data }: { data: BASE1155Collection } = await res.json();
        console.log(`1155data: ${JSON.stringify(data, null, 2)}`);
        return data.collection?.collectionHoldings[0] ?? null;
    },
};


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

export const eth1155Holder = async (tokenAddy: string, rank: number) => {
    const query = GraphQuery.eth1155TopHolder(tokenAddy.toLowerCase(), rank);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };
    const res = await fetch(AppConfig.theGraph.eth1155subgraph, options);
    // console.log(res);
    const { data }: { data: ETH1155Collection } = await res.json();
    console.log(`1155data: ${JSON.stringify(data, null, 2)}`);
    return data.collection?.collectionHoldings[0] ?? null;
};

type ETH721Collection = {
    collection?: {
        holdings: {
            tokenCount: string;
            account: {
                id: string;
            };
        }[];
    };
};

export const eth721Holder = async (tokenAddy: string, rank: number) => {
    const query = GraphQuery.eth721TopHolder(tokenAddy.toLowerCase(), rank);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };
    const res = await fetch(AppConfig.theGraph.eth721subgraph, options);
    // console.log(res);
    const { data }: { data: ETH721Collection } = await res.json();
    console.log(`721data: ${JSON.stringify(data, null, 2)}`);
    return data.collection?.holdings[0] ?? null;
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

export type ZoraTransfersResposeBody = {
    items: TokenTransfer[];
};

export type TokenTransfer = {
    block_hash: string;
    method: string;
    timestamp: string;
    to: {
        ens_domain_name?: string;
        hash: string;
    };
    total: {
        token_id: string;
    };
    type: "token_minting";
};

export type Holder = {
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

interface GroupedHolder {
    addressHash: string;
    totalValue: number;
  }

export const zoraRankedHolderByREST = async (tokenAddy: string, rank: number) => {
    const res = await fetch(
        AppConfig.zoraRestUrl + "/tokens/" + tokenAddy.toLowerCase() + "/holders"
    );
    const { items }: { items: Holder[] } = await res.json();

    // Group holders by their address hash and sum up the "value" field
    const groupedHolders = items.reduce<GroupedHolder[]>((acc, holder) => {
        const addressHash = holder.address.hash;
        const existingHolder = acc.find(
            (item) => item.addressHash === addressHash
        );
        if (existingHolder) {
            existingHolder.totalValue += parseInt(holder.value); // Assuming "value" is a string representation of a number
        } else {
            acc.push({
                addressHash,
                totalValue: parseInt(holder.value),
            });
        }
        return acc;
    }, []);

    // Sort the grouped holders by total value in descending order
    groupedHolders.sort((a, b) => b.totalValue - a.totalValue);

    // Get the nth top holder
    const rankedTopHolder = groupedHolders[rank]
    console.log(`rankedTopHolder: ${JSON.stringify(rankedTopHolder, null, 2)}`);
    return rankedTopHolder
};

