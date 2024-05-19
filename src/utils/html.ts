import * as fs from "fs";
import { logger } from "../log";

export class Html {
  constructor(private path: string, private data: any) {}

  // reading the file content from the path
  readFile() {
    const htmlPath = this.path;
    if (!fs.existsSync(htmlPath)) {
      logger.error("Html file cannot be located");
      return "";
    }

    return fs.readFileSync(htmlPath, "utf-8");
  }

  // inject the data into the html content
  render() {
    const injectables = Object.keys(this.data);
    let content = this.readFile();
    for (const injectable of injectables) {
      content = content.replaceAll(
        `{${injectable as string}}`,
        this.data[injectable as string] as string
      );
    }

    return content;
  }
}
