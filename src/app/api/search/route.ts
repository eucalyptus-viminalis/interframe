import { FrameSignaturePacket } from "@/src/fc/FrameSignaturePacket";
import "@/src/utils/ethereum-address";
import { NextRequest } from "next/server";
import { AppConfig } from "../../AppConfig";
import { SearchFrame } from "./frame";

export async function GET() {
  return SearchFrame();
}

export async function POST(req: NextRequest) {
  const data: FrameSignaturePacket = await req.json();
  const inputText = data.untrustedData.inputText;

  // Case 1: pressed home button
  if (data.untrustedData.buttonIndex == 2) {
    const res = await fetch(AppConfig.hostUrl + "/api/home");
    return new Response(res.body, { headers: { "Content-Type": "text/html" } });
  }
  // Case 2: pressed "submit" button + no input text
  else if (data.untrustedData.buttonIndex == 1 && !inputText) {
    // - take user to error page with backUrl to /api/search
    const errorMsg = encodeURIComponent("No input submitted.");
    const backUrl = AppConfig.hostUrl + "/api/search";
    const res = await fetch(
      AppConfig.hostUrl + `/api/error?errorMsg=${errorMsg}&backUrl=${backUrl}`,
    );
    return new Response(res.body, { headers: { "Content-Type": "text/html" } });
  }
  // Case 3: pressed "submit" button + some input text
  else if (data.untrustedData.buttonIndex == 1 && inputText) {
    // Switch on inputText
    // Case 1: is valid ethereum address
    // - take user to summary page
    if (inputText.trim().isValidEthereumAddress()) {
      const res = await fetch(
        AppConfig.hostUrl +
          `/api/summary?tokenAddy=${data.untrustedData.inputText}`,
      );
      return new Response(res.body, {
        headers: { "Content-Type": "text/html" },
      });
      // Case 2: is not valid ethereum address
    } else if (!inputText.trim().isValidEthereumAddress()) {
      // TODO: Try to match inputText as token name
      const res = await fetch(
        AppConfig.hostUrl +
          `/api/search/results?query=${encodeURIComponent(inputText.trim())}`,
      );
      return new Response(res.body, {
        headers: { "Content-Type": "text/html" },
      });
    }
    // - take user to error page with backUrl to /api/search
  } else {
  }
}
