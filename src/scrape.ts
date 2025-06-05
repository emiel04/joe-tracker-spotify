import puppeteer from "puppeteer"
import type { Song } from "./domain/song";
import config from "./config";

export async function getCurrentSong(): Promise<Song> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(config.JOE_URL, { waitUntil: "networkidle2" });

  await page.waitForSelector("#main");

  const result: Song | null = await (page.evaluate(() => {
    // @ts-ignore
    const container = document.querySelector("#main > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)");

    if (!container) return null;

    const songDiv = container.querySelector("div:nth-child(1)");
    const artistDiv = container.querySelector("div:nth-child(2)");

    const song:string = songDiv?.textContent?.trim() || "";
    const artist:string = artistDiv?.textContent?.trim() || "";

    return {
      name: song, artist
    } as Song;
  })) ;


  if (!result?.name || !result?.artist) throw new Error(`Could not extract song info for: ${JSON.stringify(result)}`);

  return result;
}

