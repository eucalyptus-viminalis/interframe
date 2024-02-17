import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import { NetworkInfo } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { AppConfig } from "../app/AppConfig";

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
export const ZDKNetworkInfos = [ethMainnet, zoraMainnet, baseMainnet]

const args = {
    endPoint: AppConfig.zoraGraphql,
    networks: ZDKNetworkInfos,
};
export const zdk = new ZDK(args);