export type FrameSignaturePacket = {
    untrustedData : {
        fid: number,
        url: string,
        messageHash: string,
        timestamp: string,
        network: number,
        buttonIndex: number,
        castId: {
            fid: number,
            hash: string
        }
    },
    trustedData: {
        messageBytes: string
    }
}

// Example
// {
//     "untrustedData": {
//         "fid": 2,
//         "url": "https://fcpolls.com/polls/1",
//       "messageHash": "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
//         "timestamp": 1706243218,
//         "network": 1,
//         "buttonIndex": 2,
//         "castId": {
//             fid: 226,
//             hash: "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9",
//         }
//     },
//     "trustedData": {
//         "messageBytes": "d2b1ddc6c88e865a33cb1a565e0058d757042974...",
//     }
// }