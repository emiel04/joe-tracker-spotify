import config from "./config.ts";
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

run();
