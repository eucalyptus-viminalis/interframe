import { init } from "@airstack/node";
import { fetchQuery } from "@airstack/node";
import { AppConfig } from "../../AppConfig";

init(AppConfig.airstackApiKey, "dev");

interface QueryResponse {
    data: TokenBalancesData;
    error: Error;
}

export interface TokenBalancesData {
    TokenBalances: {
        TokenBalance: TokenBalance[]
    };
}

interface Error {
    message: string;
}

interface TokenBalance {
    owner: {
        socials: Social[] | null
    }
    amount: string
    formattedAmount: number
}

interface Social {
    dappName: "lens" | "farcaster";
    followerCount: number;
    fnames: string[] | null
}

const gql = (ca: string, blockchain: string) => `
query MyQuery {
    TokenBalances(
      input: {blockchain: ${blockchain}, filter: {tokenAddress: {_eq: "${ca}"}}, limit: 200}
    ) {
        TokenBalance {
            owner {
              socials {
                dappName
                fnames
                followerCount
              }
            }
            amount
            formattedAmount
          }
          pageInfo {
            hasNextPage
            hasPrevPage
            nextCursor
            prevCursor
          }
    }
  }
`;

export const getData = async (ca: string, blockchain: string) => {
    const { data, error } = await fetchQuery(gql(ca, blockchain));

    if (error) {
        throw new Error(error.message);
    }
    return data;
};
