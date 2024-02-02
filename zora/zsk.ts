import {ZDK, ZDKChain, ZDKNetwork} from "@zoralabs/zdk"
import { ZORA_GRAPHQL } from "./consts"
import { NetworkInfo } from "@zoralabs/zdk/dist/queries/queries-sdk"

// NetworkInfo
const ethMainnet: NetworkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet
}
const zoraMainnet: NetworkInfo = {
    network: ZDKNetwork.Zora,
    chain: ZDKChain.ZoraMainnet
}
const args = {
    endPoint: ZORA_GRAPHQL,
    networks: [ethMainnet, zoraMainnet],
}

export const zdk = new ZDK(args)