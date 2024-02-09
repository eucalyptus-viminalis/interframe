export type Cast = {
    data: {
        type: string;
        fid: number;
        timestamp: number;
        network: string;
        castAddBody: {
            parentUrl: string;
            text: string;
            embeds: {
                url: string;
            }[];
        };
    };
    hash: string;
    hashScheme: string;
    signature: string;
    signatureScheme: string;
    signer: string;
};