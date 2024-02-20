import { Frame200Response } from "@/src/fc/Frame200Response"
import { FrameContent } from "@/src/fc/FrameContent"
import { AppConfig } from "../../AppConfig"

export function SearchFrame() {
  const frameContent: FrameContent = {
    frameButtons: [
      { action: 'post', label: '<submit>' },
      { action: 'post', label: '<home>' },
    ],
    frameImageUrl: AppConfig.hostUrl + '/api/image/search',
    framePostUrl: AppConfig.hostUrl + '/api/search',
    frameTitle: 'search | interframe',
    frameVersion: 'vNext',
    input: true,
  }
  return Frame200Response(frameContent)
}
