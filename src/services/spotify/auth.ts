import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import fetch from "node-fetch";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires?: number;
};

async function getAccessToken(): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = (await res.json()) as SpotifyTokenResponse;

  if (!res.ok || !data.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function getSpotifySdk(): Promise<SpotifyApi> {
  const token = await getAccessToken();
  return SpotifyApi.withAccessToken(clientId, token);
}

let cachedSdk: SpotifyApi | null = null;
let cacheExpiresAt = 0;

export async function getCachedSpotifySdk() {
  const now = Date.now();

  if (!cachedSdk || now >= cacheExpiresAt) {
    cachedSdk = await getSpotifySdk();
    cacheExpiresAt = now + 5 * 60 * 1000; // cache for 5 minutes
  }

  return cachedSdk;
}
