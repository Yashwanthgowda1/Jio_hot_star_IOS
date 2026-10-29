import fs from "node:fs";
import path from "node:path";
import type { AppConfig } from "../types/app-config.interface";

export class FileReader {
  static readconfigFile(
    filePath = path.resolve(process.cwd(), "..", "config.json"),
  ): AppConfig {
    const configContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(configContent) as AppConfig;
  }
}
