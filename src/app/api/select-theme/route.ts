import { NextRequest } from "next/server";
import { SelectThemeFrame } from "./frame";
import { AppConfig } from "../../AppConfig";
import { AirstackColorsData } from "../../airstack/colors/data";

export async function GET(req: NextRequest) {
  const eoas = req.nextUrl.searchParams.get("eoas");
  const fid = req.nextUrl.searchParams.get("fid");
  const skip = req.nextUrl.searchParams.get("skip");
  if (!(eoas || fid)) {
    return new Response('missing param: "eoas" or "fid"', { status: 400 });
  }

  if (eoas) {
    const res = await fetch(
      AppConfig.hostUrl + `/airstack/colors?eoas=${eoas}`,
    );
    const data: AirstackColorsData = await res.json();
    if (!data.colors || data.colors.length == 0) {
      return new Response("no colors detected", { status: 404 });
    }
    const curIndex = skip ? +skip : 0;
    const more = data.colors.length > curIndex + 1;
    const theme = data.colors[curIndex];
    if (!theme) {
      return new Response(`skip value too big: ${skip}`, { status: 404 });
    }
    return SelectThemeFrame({
      fartoneColor: theme.fartoneColor,
      fartoneTokenId: theme.fartoneTokenId,
      hexColors: theme.hexColors.join(","),
      image: theme.imageAirstack ?? theme.imageContract,
      more: more,
      curIndex: curIndex,
    });
  }
}
