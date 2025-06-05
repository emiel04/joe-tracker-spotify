import config from "../../core/config";
import type { Song } from "../../core/domain/song";
import { getCachedSpotifySdk } from "./auth";
import logger from "../../core/logger";

export async function addSongToSpotifyPlaylist(song: Song): Promise<void> {
  const sdk = await getCachedSpotifySdk();

  const searchResult = await sdk.search(`${song.name} ${song.artist}`, [
    "track",
  ]);

  const track = searchResult.tracks?.items?.[0];
  if (!track) {
    logger.warn(`Could not find track: ${song.name} by ${song.artist}`);
    return;
  }

  await sdk.playlists.addItemsToPlaylist(config.PLAYLIST_ID, [track.uri]);

  logger.info(`Added: ${track.name} by ${track.artists[0]!.name}`);
}
