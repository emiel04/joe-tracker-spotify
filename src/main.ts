import config from "./core/config.ts";
import logger from "./core/logger.ts";
import { getCurrentSong } from "./services/scraper";
import { addSongToSpotifyPlaylist } from "./services/spotify";

process.once("SIGINT", () => {
  process.exit(0);
});

process.once("SIGTERM", () => {
  process.exit(0);
});

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
      logger.error("Crashed with error:");
      logger.error(err);
      logger.info("Restarting...");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

startWithRestart();
