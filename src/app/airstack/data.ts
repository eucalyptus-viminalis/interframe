import { init } from "@airstack/node";
import { fetchQuery } from "@airstack/node";
import { AppConfig } from "../AppConfig";

init(AppConfig.airstackApiKey, "dev");

interface QueryResponse {
    data: Data;
    error: Error;
}

interface Data {
    Wallet: Wallet;
}

interface Error {
    message: string;
}

interface Wallet {
    socials: Social[];
    addresses: string[];
}

interface Social {
    dappName: "lens" | "farcaster";
    profileName: string;
}

const query = `
query MyQuery {
  Wallet(input: {identity: "vitalik.eth", blockchain: ethereum}) {
    socials {
      dappName
      profileName
    }
    addresses
  }
}
`;

export const getData = async () => {
    const { data, error }: QueryResponse = await fetchQuery(query);

    if (error) {
        throw new Error(error.message);
    }
    return data
};

