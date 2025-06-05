# Joe tracker

A small service that scrapes the current song playing on the Joe sit and adds it to a Spotify playlist automatically.

Currently only tested with
- [Joe 80s 90s](https://joe.be/luister/joe_80s_90s)

## Features
- Scrapes current song and artist info
- Searches the song on spotify and adds it to a configured playlist

## Setup
1. Clone the repo
2. Install dependencies

`bun install`

3. Get spotify refresh token with the [`scripts/get_refresh_token.ts`](./scripts/get_refresh_token.ts) script.

4. Pass env variables based on the [`.env.example`](./.env.example)

5. Run with `bun run start`

## Docker

Just make sure the correct env variables are passed to docker and it should work. You should still get your spotify refresh token.