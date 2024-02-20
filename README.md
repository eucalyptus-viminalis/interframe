# interframe

Live on Warpcast: https://warpcast.com/3070/0xb1cfd7bc

![home](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/22988dc5-4704-4d71-84af-71818a0dc45b)

1. [Overview](https://github.com/eucalyptus-viminalis/interframe#overview)
2. [Integration](https://github.com/eucalyptus-viminalis/interframe#integration)
3. [Frame Flow](https://github.com/eucalyptus-viminalis/interframe#frame-flow)
4. [Features](https://github.com/eucalyptus-viminalis/interframe#features)
5. [Technologies](https://github.com/eucalyptus-viminalis/interframe#technnologies)

## Overview

interframe is a Farcaster Frame implementation of a blockchain reader for NFT collections.

Try it in action: [Try me](https://warpcast.com/3070/0xb1cfd7bc)

## Integration

> a.k.a. interframation

This is a special note to any frame devs out there

If you'd like to refer to this frame in anyway, the home page can be retrived by fetching this url:
`https://interframe-eight.vercel.app/api/home`

If you'd like to **navigate user to a summary page for a particular token** that you'd provide to interframe, fetch the `/api/summary` endpoint with the collection address as a `tokenAddy` query parameter.

**Example**
```ts
// Handing off frame to interframe/summary example:
// request URL: https://interframe-eight.vercel.app/api/summary?tokenAddy=0xb0349245e142635f0ea094e413502f6223d37cd7
const res = await fetch('https://interframe-eight.vercel.app/api/summary?tokenAddy=0xb0349245e142635f0ea094e413502f6223d37cd7)'
return new Response(res.body, {headers: {'Content-Type'}: 'text/html'})
```

### Endpoints

Name | Endpoint | Notes
-|-|-
Homepage | `https://interframe-eight.vercel.app/api/home` | No query parameters required
Summary | `https://interframe-eight.vercel.app/api/summary?tokenAddy=` | tokenAddy: a string representing a token address
Latest mints | `https://interframe-eight.vercel.app/api/latest-mints?tokenAddy=` | tokenAddy: a string representing a token address
Top holders | `https://interframe-eight.vercel.app/api/holders?tokenAddy=` | tokenAddy: a string representing a token address

> These endpoints can all be fetched with a `GET` request as in the example shown above.

## Frame Flow

After the user selects a particular token, interframe navigates the user to view useful information about that token.

This includes a summary, top holders, latest mints, and popular casts related to the selected token.

It currently supports ERC-721 and ERC-1155 tokens on *Base*, *Ethereum*, and *Zora*.

## Features

### My Tokens (`/api/select-blockchain` `/api/my-tokens`)

Users can browse from a selection of tokens that they own.

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/d2da69e0-2fc9-4f22-9c96-161e80a82e1e">

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/afd50f90-53c5-4c07-8340-ae4bd2d1dd5c">

### Search (`/api/search`)

Users can input and submit a contract address or token name to view blockchain data about that token.

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/57f277b6-a7fa-4fc0-ae06-5cac9f24c570">

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/1580b1a2-488a-4543-9492-377e2c9e2494">




### Summary (`/api/summary`)

The summary page gives a brief summary of a specific token.

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/11261951-0fd4-422f-83ec-94d30142a981">

### Top Holders (`/api/holders`)

The top holders page allows users to nagivate through the top 10 holders of a collection.

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/7b7b9fc6-8d38-4898-bacd-00d2a0929a73">

### Latest Mints (`/api/latest-mints`)

The latest mints page allows users to nagivate through the latest mints of a collection.

<img width="517" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/c33353ee-48cb-4254-afd2-943815fb668f">

### Popular Casts

> Note: This feature is yet to be implemented

## Technologies

interframe uses several APIs to retreive its data.

- `zdk`: ZDK is a Typescript abstraction of Zora's GraphQL API
  - usage: the zdk is being used in interframe to retrieve basic information about a collection. This information is served in `/api/summary`
  - website: [ZDK](https://docs.zora.co/docs/zora-api/zdk)
- `The Graph`: The Graph is a collection of decentralized GraphQL APIs
  - usage: The Graph is being used in interframe to retrieve information about top holders for collections on Ethereum and Base. This information is served in `/api/holders`
  - website: [The Graph](https://thegraph.com/)
- `@vercel/og`: This Typescript library exposes a convenience method to generate a valid OpenGraph image using JSX elements. It uses `satori` under the hoood.
  - usage: `ImageResponse` is used for generating all OpenGraph images for interframe. See: `/api/images/*`
  - website: [Vercel OG](https://vercel.com/docs/functions/og-image-generation)
- `Farcaster Frame`: Farcaster Frame(s) are an extension of the OpenGraph protocol to generate interactive content on decentralized social platforms.
  - usage: The API routes return a valid response that adheres to the Farcaster Frames spec
  - website: [Farcaster Frame spec](https://docs.farcaster.xyz/reference/frames/spec)
- `Airstack`: A GraphQL API for decentralized social graphs and Ethereum+ blockchains
  - usage: Airstack is used to deduce Farcaster-related information about a token. E.g. using `TokenBalances` query to calculate what percentage of the holder base are verified Farcaster accounts. It is also being used for the query string search functionality on `/api/search/results` route.
  - website: [Airstack](https://www.airstack.xyz/)


