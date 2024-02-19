import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { getData } from "./data";

export async function SelectBlockchainFrame(fid: number) {
    const data = await getData(fid)
    const eoas = data.eoas
    const postParams = `eoas=${eoas}`
    const frameContent: FrameContent = {
        frameButtons: [
            {action: 'post', label: '<back'},
            {action: 'post', label: 'base'},
            {action: 'post', label: 'eth'},
            {action: 'post', label: 'zora'},
        ],
        frameImageUrl: AppConfig.hostUrl + '/api/select-blockchain/image',
        framePostUrl: AppConfig.hostUrl + '/api/select-blockchain?' + postParams,
        frameTitle: 'select-blockchain | inteframe',
        frameVersion: 'vNext',
        // input,
    }
    return Frame200Response(frameContent)
}