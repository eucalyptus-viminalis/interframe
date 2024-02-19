import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { SortDirection } from "@zoralabs/zdk";
import { MintSortKey } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { ipfsSrcToUrl } from "@/src/ipfs/ipfs";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { client } from "@/src/neynar/client";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { zdk } from "@/src/zdk/client";

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const MAX_ROUTE_LENGTH = 10; // Maximum number of top holders to show
const LAST_INDEX = MAX_ROUTE_LENGTH - 1; // Last page index to show

export async function MintFrame(idx: number, collectionAddress: string) {
  const frameContent: FrameContent = {
    frameButtons: [],
    frameImageUrl: AppConfig.hostUrl,
    framePostUrl:
      AppConfig.hostUrl +
      `/api/latest-mints?idx=${idx}&tokenAddy=${collectionAddress}`,
    frameTitle: "see Zora | latest mints",
    frameVersion: "vNext",
  };
  // Get mint transfers
  const data = await zdk.mints({
    where: {
      collectionAddresses: [collectionAddress],
    },
    includeFullDetails: false,
    includeMarkets: false,
    sort: {
      sortDirection: "DESC" as SortDirection,
      sortKey: "TIME" as MintSortKey,
    },
    pagination: {
      limit: 10,
    },
  });
  // Set buttons
  frameContent.frameButtons =
    idx >= data.mints.nodes.length - 1 || idx >= LAST_INDEX
      ? [
        {
          action: "post",
          label: "<back",
        },
        {
          action: "post",
          label: "<summary",
        },
      ]
      : [
        {
          action: "post",
          label: "<back",
        },
        {
          action: "post",
          label: "next>",
        },
        {
          action: "post",
          label: "<summary",
        },
      ];
  // If it's the last holder to show, append a query param to postUrl
  if (idx >= data.mints.nodes.length - 1 || idx >= LAST_INDEX) {
    frameContent.framePostUrl += "&last=true";
  }
  const mint = data.mints.nodes[idx];
  console.log(`mint: ${JSON.stringify(mint, null, 2)}`)
  const img = mint.token?.image?.url
  // const img = sanitiseForPossibleIPFS(mint.token?.image?.url)
  const tokenId = mint.mint.tokenId;
  let mintTimestamp = mint.mint.transactionInfo.blockTimestamp;
  mintTimestamp = encodeURIComponent(timeAgo.format(new Date(mintTimestamp)));
  const to = mint.mint.toAddress;
  const tokenName = mint.token?.tokenContract?.name
  frameContent.frameImageUrl += `/api/image/mint?img=${img ? ipfsSrcToUrl(img) : ''}&tokenId=${tokenId}&mintTimestamp=${mintTimestamp}&to=${to}`;
  frameContent.frameImageUrl += `&tokenName=${tokenName ? encodeURIComponent(tokenName) : ''}`

  try {
    // Example
    // vitalik.eth
    // const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
    const user = await client.lookupUserByVerification(to);
    const username = user.result.user.username;
    const pfp = user.result.user.pfp.url;
    frameContent.frameImageUrl += `&username=${username}&pfp=${pfp}`;
  } catch {
    console.log("neynar lookupUserByVerification failed.");
    // TODO: handle error
  }
  return Frame200Response(frameContent);
}
