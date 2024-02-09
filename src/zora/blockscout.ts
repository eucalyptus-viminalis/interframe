import { AppConfig } from "@/src/app/AppConfig";

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
