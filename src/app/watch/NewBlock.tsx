"use client";
import { useEffect, useState } from "react";
import { OnBlockParameter, createPublicClient, http, webSocket } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  transport: webSocket(process.env.NEXT_PUBLIC_BASE_WS!),
  chain: base,
});

const httpClient = createPublicClient({
  transport: http(),
  chain: base,
});

export default async function NewBlock() {
  const [txHashes, setTxHashes] = useState<`0x${string}`[]>();
  useEffect(() => {
    const onBlock = async (b: OnBlockParameter) => {
      setTxHashes(b.transactions);
      const promises = await Promise.all(
        b.transactions.map((tx) => {
          httpClient.getTransactionReceipt({ hash: tx });
        }),
      );
      console.log(promises);
    };

    const unwatch = client.watchBlocks({
      onBlock: onBlock,
    });

    // Clean up function
    return () => {
      unwatch(); // Unsubscribe from watching block number when component unmounts
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <div>
      <h1>New Transactions</h1>
      {txHashes ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {txHashes.map((txHash) => {
            return <span>{txHash}</span>;
          })}
        </div>
      ) : null}
    </div>
  );
}
