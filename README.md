# interframe

1. [Overview](https://github.com/eucalyptus-viminalis/interframe#overview)
2. [Frame Flow](https://github.com/eucalyptus-viminalis/interframe#frame-flow)
3. [Features](https://github.com/eucalyptus-viminalis/interframe#features)
4. [Technologies](https://github.com/eucalyptus-viminalis/interframe#technnologies)
5. [Frame Screenshots](https://github.com/eucalyptus-viminalis/interframe#frame-screenshots)

## Overview

interframe is a Farcaster Frame implementation of a blockchain reader for NFT collections.

## Frame Flow

After the user selects a particular token, interframe navigates the user to view useful information about that token.

This includes a summary, top holders, latest mints, and popular casts related to the selected token.

It currently supports ERC-721 and ERC-1155 tokens on *Base*, *Ethereum*, and *Zora*.

## Features

### Browse (`/api/browse`)

Users can browse from a hand-picked selection of token collections.

### Search (`/api/search`)

> Note: This feature is yet to be implemented

Users can input and submit a contract address or token name to view blockchain data about that token.

### Summary (`/api/summary`)

The summary page gives a brief summary of the token collection that the user selects.

### Top Holders (`/api/holders-graph`)

The top holders page allows users to nagivate through the top 10 holders of a collection.

### Latest Mints (`/api/latest-mints`)

The latest mints page allows users to nagivate through the latest mints of a collection.

### Popular Casts

> Note: This feature is yet to be implemented

## Technologies

interframe uses several APIs to retreive its data.

- `zdk`: ZDK is a Typescript abstraction of Zora's GraphQL API
  - usage: the zdk is being used in interframe to retrieve basic information about a collection. This information is served in `/api/summary`
  - website: [ZDK](https://docs.zora.co/docs/zora-api/zdk)
- `The Graph`: The Graph is a collection of decentralized GraphQL APIs
  - usage: The Graph is being used in interframe to retrieve information about top holders for collections on Ethereum and Base. This information is served in `/api/holders-graph`
  - website: [The Graph](https://thegraph.com/)
- `@vercel/og`: This Typescript library exposes a convenience method to generate a valid OpenGraph image using JSX elements. It uses `satori` under the hoood.
  - usage: `ImageResponse` is used for generating all OpenGraph images for interframe. See: `/api/images/*`
  - website: [Vercel OG](https://vercel.com/docs/functions/og-image-generation)
- `Farcaster Frame`: Farcaster Frame(s) are an extension of the OpenGraph protocol to generate interactive content on decentralized social platforms.
  - usage: The API routes return a valid response that adheres to the Farcaster Frames spec
  - website: [Farcaster Frame spec](https://docs.farcaster.xyz/reference/frames/spec)

## Frame Screenshots

### /api/home

![home](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/22988dc5-4704-4d71-84af-71818a0dc45b)

### /api/browse

![browse](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/441d02d8-d130-433f-b326-7867ea468d89)

### /api/summary

![summary](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/f3a524f8-47b0-4da5-aa75-b68f918b299c)

### /api/holders-graph

![holder](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/79346301-c187-4c8c-a489-5002ed6ec476)

### /api/latest-mints

![mint](https://github.com/eucalyptus-viminalis/interframe/assets/65995595/d029d62d-d461-4477-99ce-403fd48886d3)

