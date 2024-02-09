
export enum USER_DATA_TYPE {
    PFP = 1,
    USERNAME = 6,
}

export type User = {
    data: {
        type: string;
        fid: number;
        timestamp: number;
        userDataBody: {
            type: string;
            value: string;
        };
    };
    hash: string;
    hashScheme: string;
    signature: string;
    signatureScheme: string;
    signer: string;
};