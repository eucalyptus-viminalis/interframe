import { NextRequest } from "next/server";
import { search } from "./data";
import { AppConfig } from "@/src/app/AppConfig";
import { SearchResultsFrame } from "./frame";
import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const skip = req.nextUrl.searchParams.get("skip");
  if (!query) {
    return new Response('missing param: "query"', { status: 400 });
  }
  return SearchResultsFrame(decodeURIComponent(query), skip ? +skip : 0);
  // TODO: Return frame
}

// POST: /api/search/results
// Params:
// - token1Addy?
// - token2Addy?
// - skip
export async function POST(req: NextRequest) {
  const token1Addy = req.nextUrl.searchParams.get("token1Addy");
  const token2Addy = req.nextUrl.searchParams.get("token2Addy");
  const query = req.nextUrl.searchParams.get("query");
  const skip = req.nextUrl.searchParams.get("skip");
  if (!skip) {
    return new Response("missing param: skip", { status: 400 });
  }
  const data: FrameSignaturePacket = await req.json();
  // route request
  if (data.untrustedData.buttonIndex == 1 && +skip == 0) {
    const res = await fetch(AppConfig.hostUrl + `/api/search`);
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  } else if (data.untrustedData.buttonIndex == 1 && +skip != 0) {
    const res = await fetch(
      AppConfig.hostUrl +
        `/api/search/results?query=${query}&skip=${+skip - 2}`,
    );
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  } else if (data.untrustedData.buttonIndex == 2 && token1Addy) {
    const res = await fetch(
      AppConfig.hostUrl + `/api/summary?tokenAddy=${token1Addy}`,
    );
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  } else if (data.untrustedData.buttonIndex == 3 && token2Addy) {
    const res = await fetch(
      AppConfig.hostUrl + `/api/summary?tokenAddy=${token2Addy}`,
    );
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  } else if (data.untrustedData.buttonIndex == 4) {
    const res = await fetch(
      AppConfig.hostUrl +
        `/api/search/results?query=${query}&skip=${+skip + 2}`,
    );
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  } else {
    const errorMsg = encodeURIComponent(
      "Bad route. Ping @3070 to report error encountered.",
    );
    const res = await fetch(
      AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}`,
    );
    return new Response(res.body, { headers: { "content-type": "text/html" } });
  }
}
