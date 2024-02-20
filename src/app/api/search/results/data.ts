import { fetchQuery, init } from "@airstack/node";
import { Variables } from "@airstack/node/dist/types/types";
import "@/src/utils/string-casings";
import { AppConfig } from "@/src/app/AppConfig";

type SearchReturnType = {
  results: SearchResult[];
};
type SearchResult = {
  ca: string;
  tokenName?: string;
  chain?: "zora" | "base" | "ethereum" | string;
  tokenStandard?: "erc721" | "erc1155" | string;
  image?: string | null;
  totalSupply?: string;
};

init(AppConfig.airstackApiKey);

type FetchResponse = {
  data: {
    Base: {
      Token: Token[] | null;
    };
    Ethereum: {
      Token: Token[] | null;
    };
    Zora: {
      Token: Token[] | null;
    };
  };
  error: Error;
};

type Token = {
  address: string;
  blockchain: string;
  name: string;
  symbol: string;
  type: string;
  totalSupply: string;
  logo: {
    small: string | null;
  };
};

type Error = {
  message: string;
};

export async function search(
  tokenNameQuery: string,
): Promise<SearchReturnType> {
  const gql = `
    query SearchQuery($queryStrs: [String!]) {
      Base: Tokens(input: {filter: {name: {_in: $queryStrs}, type: {_in: [ERC1155, ERC721]}}, blockchain: base, limit: 10}) {
        Token {
          address
          blockchain
          name
          symbol
          type
          totalSupply
          logo {
            small
          }
        }
      }
      Ethereum: Tokens(input: {filter: {name: {_in: $queryStrs}, type: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: 10}) {
        Token {
          address
          blockchain
          name
          symbol
          type
          totalSupply
          logo {
            small
          }
        }
      }
      Zora: Tokens(input: {filter: {name: {_in: $queryStrs}, type: {_in: [ERC1155, ERC721]}}, blockchain: zora, limit: 10}) {
        Token {
          address
          blockchain
          name
          symbol
          type
          totalSupply
          logo {
            small
          }
        }
      }
    }    `;

  const vars: Variables = {
    queryStrs: [
      tokenNameQuery.toLowerCase(),
      tokenNameQuery.toUpperCase(),
      tokenNameQuery.toTitleCase(),
    ],
  };
  const { data, error }: FetchResponse = await fetchQuery(gql, vars);
  if (error) {
    throw new Error(error.message);
  }
  let empty = [] as Token[];
  const results: SearchResult[] = empty
    .concat(data.Base.Token ?? [])
    .concat(data.Zora.Token ?? [])
    .concat(data.Ethereum.Token ?? [])
    .map((t) => {
      return {
        ca: t.address,
        chain: t.blockchain,
        image: t.logo.small,
        tokenName: t.name,
        tokenStandard: t.type,
        totalSupply: t.totalSupply,
      };
    });
  return {
    results: results,
  };
}
