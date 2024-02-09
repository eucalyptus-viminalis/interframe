import { base1155QueryUrl, base721, eth1155Graph, eth721Graph } from "./client";

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

const optionsWithQuery = (query: string) => {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };
};

export const GraphCall = {
    base721: async (tokenAddy: string, rank: number) => {
        const query = GraphQuery.base721TopHolder(tokenAddy, rank);
        const res = await fetch(base721, optionsWithQuery(query));
        const { data }: { data: BASE721Collection } = await res.json();
        console.log(`721: ${JSON.stringify(data, null, 2)}`);
        return data.collection?.holdings[0] ?? null;
    },
    base1155: async (tokenAddy: string, rank: number) => {
        const query = GraphQuery.base1155TopHolder(tokenAddy, rank);
        const res = await fetch(base1155QueryUrl, optionsWithQuery(query));
        const { data }: { data: BASE1155Collection } = await res.json();
        console.log(`1155data: ${JSON.stringify(data, null, 2)}`);
        return data.collection?.collectionHoldings[0] ?? null;
    },
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
    const res = await fetch(eth1155Graph, options);
    // console.log(res);
    const { data }: { data: ETH1155Collection } = await res.json();
    console.log(`1155data: ${JSON.stringify(data, null, 2)}`);
    return data.collection?.collectionHoldings[0] ?? null;
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
    const res = await fetch(eth721Graph, options);
    // console.log(res);
    const { data }: { data: ETH721Collection } = await res.json();
    console.log(`721data: ${JSON.stringify(data, null, 2)}`);
    return data.collection?.holdings[0] ?? null;
};
