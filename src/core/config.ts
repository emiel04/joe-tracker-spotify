import dotenv from "dotenv";
dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

const config = {
  SPOTIFY_CLIENT_ID: requiredEnv("SPOTIFY_CLIENT_ID"),
  SPOTIFY_CLIENT_SECRET: requiredEnv("SPOTIFY_CLIENT_SECRET"),
  PLAYLIST_ID: requiredEnv("PLAYLIST_ID"),
  JOE_URL: requiredEnv("JOE_URL"),
  UPDATE_SECONDS: Number(process.env.UPDATE_SECONDS ?? 60),
};

export default config;
