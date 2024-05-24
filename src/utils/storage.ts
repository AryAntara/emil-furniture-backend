import { write } from "bun";
import { telegramBot } from "../telegraf";
import { logger } from "../log";
import { unlinkSync } from "node:fs";
import { PhotoSize } from "telegraf/typings/core/types/typegram";

export class Storage {
  // store file into telegram bot
  static async store(file: Blob) {
    const filename = `cache_files_${Date.now()}_emil`;
    const path = `./dist/${filename}`;
    await write(path, file);
    try {
      const botResp = await telegramBot.telegram.sendPhoto(
        process.env.CHAT_ID ?? "5684085628",
        {
          source: path,
        }
      );

      unlinkSync(path);
      const fileId = botResp.photo.reduce(
        (actual: PhotoSize, current: PhotoSize) => {
          if ((current.file_size ?? 0) > (actual.file_size ?? 0))
            return current;
          return actual;
        },
        botResp.photo[0]
      ).file_id;

      const url = await Storage.retrive(fileId)
      return url?.toString() ?? null;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  // retrive image from a imageId
  static async retrive(imageId: string) {
    try {
      const botResp = await telegramBot.telegram.getFileLink(imageId);
      return botResp;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}
