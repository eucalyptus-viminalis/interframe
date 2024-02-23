import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { FrameButton } from "@/src/fc/FrameButton";

type SelectThemeFrameArgs = {
  hexColors: string;
  fartoneColor: string;
  fartoneTokenId: string;
  image?: string;
  curIndex: number;
  more: boolean;
};

export async function SelectThemeFrame(args: SelectThemeFrameArgs) {
  const { fartoneColor, fartoneTokenId, hexColors, more, image, curIndex } =
    args;
  const frameButtons: FrameButton[] = [];
  if (curIndex == 0) {
    frameButtons.push({ action: "post", label: "<back" });
  } else {
    frameButtons.push({ action: "post", label: `1..${curIndex}` });
  }
  frameButtons.push({ action: "post", label: "select" });
  if (more) {
    frameButtons.push({ action: "post", label: "next>" });
  }
  const imageParams = new URLSearchParams();
  // let imageParams = "";
  const postParams = new URLSearchParams();
  imageParams.set("hexColors", hexColors);
  imageParams.set("fartoneColor", fartoneColor);
  imageParams.set("image", image ?? "");

  postParams.set("fartoneTokenId", fartoneTokenId);

  const frameContent: FrameContent = {
    frameButtons: frameButtons,
    frameImageUrl: AppConfig.hostUrl + `/api/select-theme/image?` + imageParams,
    framePostUrl: AppConfig.hostUrl + `/api/select-theme?` + postParams,
    frameTitle: "select-theme | interframe",
    frameVersion: "vNext",
    // input
  };
  return Frame200Response(frameContent);
}
