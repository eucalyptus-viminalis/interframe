import { AppConfig } from "@/src/app/AppConfig";
import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { search } from "./data";
import { FrameButton } from "@/src/fc/FrameButton";

export async function SearchResultsFrame(query: string, skip: number) {
  const data = await search(query);
  const slicedData = data.results.slice(skip);
  const frameButtons: FrameButton[] = [];
  let imageParams = "";
  let postParams = `query=${encodeURIComponent(query)}`;
  if (slicedData[0]) {
    if (skip == 0) {
      frameButtons.push({ action: "post", label: "<back" });
      imageParams += `backBtn=${encodeURIComponent("<back")}`;
    } else {
      frameButtons.push({ action: "post", label: `1..${skip}` });
      imageParams += `backBtn=${"1.." + skip}`;
    }
    frameButtons.push({ action: "post", label: String(skip + 1) });
    const token1 = slicedData[0];
    const token1Name = token1.tokenName;
    const token1Addy = token1.ca;
    const token1Blockchain = token1.chain;
    const token1Type = token1.tokenStandard;
    const token1TotalSupply = token1.totalSupply;
    const token1Logo = token1.image;
    imageParams += `&token1Name=${token1Name ? encodeURIComponent(token1Name) : ""}`;
    imageParams += `&token1Addy=${token1Addy ?? ""}`;
    imageParams += `&token1Blockchain=${token1Blockchain ?? ""}`;
    imageParams += `&token1Type=${token1Type ? encodeURIComponent(token1Type) : ""}`;
    imageParams += `&token1TotalSupply=${token1TotalSupply ?? ""}`;
    imageParams += `&token1Logo=${token1Logo ? encodeURIComponent(token1Logo) : ""}`;
    imageParams += `&token1Idx=${skip + 1}`;
    postParams += `&token1Addy=${token1Addy ?? ""}`;
  } else {
    frameButtons.push({ action: "post", label: "<back" });
  }
  if (slicedData[1]) {
    frameButtons.push({ action: "post", label: String(skip + 2) });
    const token2 = slicedData[1];
    const token2Name = token2.tokenName;
    const token2Addy = token2.ca;
    const token2Blockchain = token2.chain;
    const token2Type = token2.tokenStandard;
    const token2TotalSupply = token2.totalSupply;
    const token2Logo = token2.image;
    imageParams += `&token2Name=${token2Name ? encodeURIComponent(token2Name) : ""}`;
    imageParams += `&token2Addy=${token2Addy ?? ""}`;
    imageParams += `&token2Blockchain=${token2Blockchain ?? ""}`;
    imageParams += `&token2Type=${token2Type ? encodeURIComponent(token2Type) : ""}`;
    imageParams += `&token2TotalSupply=${token2TotalSupply ?? ""}`;
    imageParams += `&token2Logo=${token2Logo ? encodeURIComponent(token2Logo) : ""}`;
    imageParams += `&token2Idx=${skip + 2}`;
    postParams += `&token2Addy=${token2Addy ?? ""}`;
  }
  if (slicedData.length > skip + 2) {
    console.log(`slicedData: ${JSON.stringify(slicedData, null, 2)}`);
    frameButtons.push({
      action: "post",
      label: `${skip + 3}..${slicedData.length}`,
    });
    imageParams += `&moreBtn=${skip + 3 + ".." + slicedData.length}`;
  }
  const frameContent: FrameContent = {
    frameButtons: frameButtons,
    frameImageUrl:
      AppConfig.hostUrl + `/api/search/results/image?` + imageParams,
    framePostUrl: AppConfig.hostUrl + `/api/search/results?` + postParams,
    frameTitle: "search results | interframe",
    frameVersion: "vNext",
    // input:
  };
  return Frame200Response(frameContent);
}
