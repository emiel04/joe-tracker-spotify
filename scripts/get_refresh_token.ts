import express from "express";
import open from "open";
import fetch from "node-fetch";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirectUri = "http://127.0.0.1:3000/callback";
const scopes = ["playlist-modify-public", "playlist-modify-private"];

const app = express();

app.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const tokenData = (await tokenResponse.json()) as any;

  console.log("Access Token:", tokenData.access_token);
  console.log("Refresh Token:", tokenData.refresh_token);
  res.send(
    "Authorization successful! You can close this tab and save the refresh token shown in console.",
  );
  process.exit(0);
});

app.listen(3000, () => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes.join(" "));
  console.log("Opening browser for Spotify authorization...");
  open(authUrl.toString());
});
