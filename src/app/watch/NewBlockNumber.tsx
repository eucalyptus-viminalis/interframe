"use client";
import { useEffect, useState } from "react";
import { createPublicClient, webSocket } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  transport: webSocket(process.env.NEXT_PUBLIC_BASE_WS!),
  chain: base,
});

export default function NewBlockNumber() {
  const [blockNumber, setBlockNumber] = useState<bigint>(BigInt(0));
  useEffect(() => {
    const onBlockNumber = (blockNumber: bigint) => {
      setBlockNumber(blockNumber);
    };

    const unwatch = client.watchBlockNumber({
      onBlockNumber: onBlockNumber,
    });

    // Clean up function
    return () => {
      unwatch(); // Unsubscribe from watching block number when component unmounts
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <div>
      <h1>{blockNumber.toString()}</h1>
    </div>
  );
}
