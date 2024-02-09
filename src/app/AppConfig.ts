export const AppConfig = {
    hostUrl: process.env['HOST']!,
    hubUrl: process.env['HUB_URL'] || "nemes.farcaster.xyz:2283",
    zoraRestUrl: "https://explorer.zora.energy/api/v2",
    neynarApiKey: process.env['NEYNAR_API_KEY']!,
    neynarGrpc: process.env['NEYNAR_GRPC']!,
    neynarHub: process.env['NEYNAR_HUB']!,
    zoradGraphql: "https://api.zora.co/graphql",
    contracts: {
        blitmap: "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63",
        zorbs: "0xCa21d4228cDCc68D4e23807E5e370C07577Dd152",
        dickbutts: "0x42069ABFE407C60cf4ae4112bEDEaD391dBa1cdB",
        monarchs: "0xc729Ce9bF1030fbb639849a96fA8BBD013680B64",
        zaibs: "0x040cABdDC5C1Ed83B66e0126E74E7F97e6eC36BC"
    }
}
