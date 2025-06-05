import puppeteer, { Browser } from "puppeteer";
import type { Song } from "./domain/song";
import config from "./config";
import logger from "./logger";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function getCurrentSong(): Promise<Song> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        args: ["--no-sandbox"]
      });

      const page = await browser.newPage();

      await page.goto(config.JOE_URL, {
        waitUntil: "networkidle2",
        timeout: 20000
      });

      await page.waitForSelector("#main");

      const result: Song | null = await page.evaluate(() => {
        // @ts-ignore
        const container = document.querySelector("#main > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)");

        if (!container) return null;

        const songDiv = container.querySelector("div:nth-child(1)");
        const artistDiv = container.querySelector("div:nth-child(2)");

        const song: string = songDiv?.textContent?.trim() || "";
        const artist: string = artistDiv?.textContent?.trim() || "";

        return { name: song, artist } as Song;
      });

      if (!result?.name || !result?.artist) {
        throw new Error(`Could not extract song info: ${JSON.stringify(result)}`);
      }

      return result;
    } catch (err: any) {
      logger.error(`Attempt ${attempt + 1} failed: ${err.message || err}`);
      attempt++;
      if (attempt < MAX_RETRIES) {
        logger.info(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      } else {
        logger.error("All attempts failed.");
        throw err;
      }
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeErr) {
          logger.warn("Failed to close browser:", closeErr);
        }
      }
    }
  }

  throw new Error("Failed to fetch song info after max retries.");
}
