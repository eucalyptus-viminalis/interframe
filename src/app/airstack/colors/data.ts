import { Variables } from "@airstack/node/dist/types/types";
import { AppConfig } from "../../AppConfig";
import { fetchQuery, init } from "@airstack/node";

init(AppConfig.airstackApiKey);

export type AirstackColorsData = {
  colors: Color[];
};

type Color = {
  fartoneColor: string;
  fartoneTokenId: string;
  imageAirstack?: string;
  imageContract?: string;
  hexColors: string[];
};

type TokenBalance = {
  amount: string;
  tokenNfts: {
    metaData: {
      attributes: {
        trait_type: string;
        value: string;
      }[];
      name: string;
      image?: string;
    };
    tokenId: string;
    contentValue: {
      image: {
        medium?: string;
      };
    };
  };
};

type FetchQueryResponse = {
  data: {
    TokenBalances: {
      TokenBalance: TokenBalance[];
    };
  };
  error: {
    message: string;
  };
};

const tokenIdToHexColors: { [key: string]: string[] } = {
  "1": ["#855DCD"],
  "2": ["#0054FF"],
  "3": ["#FF0000"],
  "4": ["#060606"],
  "5": ["#A14DB3", "#FC2D06", "#FFED00", "#3ADE27", "#009FE3"],
  "6": ["#00FF7D"],
  "7": ["#FF7D00"],
  "8": ["#FFC3FF"],
  "9": ["#FAB301"],
  "10": ["#FFEDF6", "#DAB9EE", "#2470EC", "#2A1014", "#773C1E"],
  "11": ["#FF68FF"],
};

export async function getData(eoas: string[]): Promise<AirstackColorsData> {
  const gql = `
    query MyQuery($eoas: [Identity!]) {
      TokenBalances(
        input: {filter: {owner: {_in: $eoas}, tokenAddress: {_eq: "0x9648017938F6C46d6134815D14970B381ED22bDA"}}, blockchain: base}
      ) {
        TokenBalance {
          amount
          tokenNfts {
            metaData {
              attributes {
                trait_type
                value
              }
              name
              image
            }
            tokenId
            contentValue {
              image {
                medium
              }
            }
          }
        }
      }
    }   `;
  const vars: Variables = {
    eoas: eoas,
  };
  const { data, error }: FetchQueryResponse = await fetchQuery(gql, vars);
  if (error) {
    throw new Error(error.message);
  }
  console.log("token balance length: ", data.TokenBalances.TokenBalance.length);
  const colors: Color[] = data.TokenBalances.TokenBalance.map((tb) => {
    const fartoneColor = tb.tokenNfts.metaData.attributes.find(
      (a) => a.trait_type == "Color",
    )?.value;
    const hexColors = tokenIdToHexColors[tb.tokenNfts.tokenId];
    if (!(fartoneColor && hexColors)) {
      throw new Error("fartoneColor and hexColor not found");
    }
    return {
      fartoneColor: fartoneColor,
      fartoneTokenId: tb.tokenNfts.tokenId,
      imageAirstack: tb.tokenNfts.contentValue.image.medium,
      imageContract: tb.tokenNfts.metaData.image,
      hexColors: hexColors,
    };
  });
  // console.log(`colors: ${JSON.stringify(colors, null, 2)}`);
  return {
    colors: colors,
  };
  // return data;
}
