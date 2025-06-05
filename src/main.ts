import config from "./config.ts";
import logger from "./logger.ts";
import { getCurrentSong } from "./scrape.ts";
import { addSongToSpotifyPlaylist } from "./spotify/spotify.ts";

let last = "";

async function run() {
  while (true) {
    const song = await getCurrentSong();
    const id = `${song.name}|${song.artist}`;

    if (id !== last) {
      await addSongToSpotifyPlaylist(song);
      last = id;
    }

    await new Promise((r) => setTimeout(r, config.UPDATE_SECONDS * 1000));
  }
}

async function startWithRestart() {
  while (true) {
    try {
      await run();
    } catch (err) {
      logger.error("Crashed with error:", err);
      logger.info("Restarting...");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

startWithRestart();
