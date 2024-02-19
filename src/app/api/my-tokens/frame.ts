import { Frame200Response } from "@/src/fc/Frame200Response";
import { FrameContent } from "@/src/fc/FrameContent";
import { AppConfig } from "../../AppConfig";
import { getData } from "./data";
import { FrameButton } from "@/src/fc/FrameButton";

export async function MyTokensFrame(eoas: string, blockchain: string) {

    const data = await getData(eoas, blockchain)
    const buttons: FrameButton[] = [{action: 'post', label: '<back'}]    
    let imageParams = ''
    let postParams = `eoas=${eoas}&blockchain=${blockchain}`
    if (data.token1) {
        buttons.push({action: 'post', label: '🔴'})
        const tokenName1 = data.token1.name
        imageParams += `token1Text=${tokenName1 ? encodeURIComponent(tokenName1) : data.token1.ca}`
        postParams += `&tokenAddy1=${data.token1.ca}`
    }
    if (data.token2) {
        buttons.push({action: 'post', label: '🔵'})
        const tokenName2 = data.token2.name
        imageParams += `&token2Text=${tokenName2 ? encodeURIComponent(tokenName2) : data.token2.ca}`
        postParams += `&tokenAddy2=${data.token2.ca}`
    }
    if (data.more) {
        buttons.push({action: 'post', label: '🟢'})
    }

    const frameContent: FrameContent = {
        frameButtons: buttons,
        frameImageUrl: AppConfig.hostUrl + '/api/my-tokens/image?' + imageParams,
        framePostUrl: AppConfig.hostUrl + '/api/my-tokens?' + postParams,
        frameTitle: 'my-tokens | interframe',
        frameVersion: 'vNext',
        // input,
    }
    return Frame200Response(frameContent)
}