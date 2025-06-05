# Joe tracker

A small service that scrapes the current song playing on the Joe sit and adds it to a Spotify playlist automatically.

Currently only tested with
- [Joe 80s 90s](https://joe.be/luister/joe_80s_90s)

## Features
- Scrapes current song and artist info
- Searches the song on spotify and adds it to a configured playlist

## Setup
### 1. Clone the repo
### 2. Install dependencies

`bun install`

### 3. Get Spotify Refresh Token 
Before proceeding with the Joe tracker, you'll need to obtain a Spotify refresh token. This is done through the [`scripts/get_refresh_token.ts`](./scripts/get_refresh_token.ts) script. Follow these steps to retrieve the token:

1. Make sure you have a Spotify Developer account and an app created on [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add your Spotify Client ID and Client Secret to your `.env` file. You can find these in your Spotify Developer app's dashboard.
3. Run the [`scripts/get_refresh_token.ts`](./scripts/get_refresh_token.ts) script to authenticate your Spotify account and obtain the refresh token:

```bash
bun run scripts/get_refresh_token.ts
```



### 4. Set Up Environment Variables 
Create a `.env` file in the root of the project and add the environment variables. You can refer to the [`.env.example`](./.env.example) for which you can provide.


### 5. Run with `bun run start`

## Docker

Just make sure the correct env variables are passed to docker and it should work. You should still get your spotify refresh token the same way.