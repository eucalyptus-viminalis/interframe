import { client } from "@/src/neynar/client"

type SelectBlockchainData = {
    eoas: string    // comma-separated verified ethereum EOAs
}
export async function getData(fid: number): Promise<SelectBlockchainData> {
    const data = await client.fetchUserVerifications(fid)
    return {
        eoas: data.result.verifications.join(',')
    }
}