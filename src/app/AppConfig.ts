const THE_GRAPH = "https://gateway-arbitrum.network.thegraph.com/api/";

export const AppConfig = {
    airstackApiKey: process.env['AIRSTACK_API_KEY']!,
    gitHubUrl: "https://github.com/eucalyptus-viminalis/interframe",
    hostUrl: process.env["HOST"]!,
    hubUrl: process.env["HUB_URL"] || "nemes.farcaster.xyz:2283",
    zoraRestUrl: "https://explorer.zora.energy/api/v2",
    neynarApiKey: process.env["NEYNAR_API_KEY"]!,
    neynarGrpc: process.env["NEYNAR_GRPC"]!,
    neynarHub: process.env["NEYNAR_HUB"]!,
    zoraGraphql: "https://api.zora.co/graphql",
    theGraphUrl: "https://gateway-arbitrum.network.thegraph.com/api",
    theGraphApiKey: process.env["GRAPH_API_KEY"]!,
    contracts: {
        base1155Based: "0x77f58006c8dc6089e2a8cf461eff74cacc2111a7",
        base1155FrameOG: "0xb0349245e142635f0ea094e413502f6223d37cd7",
        base721BaseCaster: "0x2b34e8fa3f96fa146a3c7b6d05a7aec67cb0c3f2",
        base721Gents: "0xe51D40144373BCc2C86B3c5370cD2c54Fc3d806e",
        base721NewTech: "0x1caac5859ff4544ce513e9fbdcc3ae1f430ae75f",
        eth1155Blocks: "0x2B2a0BFf83A2101c7702f89F02dB537822D83144",
        eth721Checks: "0x34eEBEE6942d8Def3c125458D1a86e0A897fd6f9",
        eth721Monarchs: "0xc729Ce9bF1030fbb639849a96fA8BBD013680B64",
        zora1155SITG: "0x4b91c1a38eaf1997013cc19ccc3761943c83aad0",
        zora1155Zaibs: "0x040cABdDC5C1Ed83B66e0126E74E7F97e6eC36BC",
        zora721Canvas: "0x721cfd3742862b7067a3c19afc268b84a73836df",
        zora721DataField: "0x470856c6fc6ae555fce9ff2d90d4714d02979373",
    },
    theGraph: {
        eth721subgraph:
            THE_GRAPH +
            process.env["GRAPH_API_KEY"]! +
            "/subgraphs/id/CBf1FtUKFnipwKVm36mHyeMtkuhjmh4KHzY3uWNNq5ow",
        eth1155subgraph:
            THE_GRAPH +
            process.env["GRAPH_API_KEY"]! +
            "/subgraphs/id/5C6JRVzKcE9AVbT7S71EycV8eEGcfkJB9gGsyTbHMVmN",
        base721subgraph:
            THE_GRAPH +
            process.env["GRAPH_API_KEY"]! +
            "/subgraphs/id/D4ab55j22wJLqdkmepiMVcSxQ44S2DTdh5aRQ5f5EqJF",
        base1155subgraph:
            THE_GRAPH +
            process.env["GRAPH_API_KEY"]! +
            "/subgraphs/id/9LyYqhj7LqDaivsifyeYF7ERqtmisnzXWm2799qo7Xfq",
    },
};
