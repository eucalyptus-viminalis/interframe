// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
export const client = new NeynarAPIClient(process.env['NEYNAR_API_KEY']!)