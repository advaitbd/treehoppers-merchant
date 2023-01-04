const pinataSDK = require('@pinata/sdk');

export const pinata = new pinataSDK({ pinataJWTKey: process.env.JWT});
