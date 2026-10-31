import fs from "node:fs";
import path from "node:path";
import type { AppConfig, Credentials } from "../types/app-config.interface";



const credentialEnvKeys = {
  username: "USERNAME",
  password: "PASSWORD",
} as const;

export class FileReader {
  static readconfigFile(filePath:string): AppConfig {
   
    const configContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(configContent) as AppConfig;
  }

  static readenvFile(filePath: string = path.resolve(__dirname, "../../.env.example")): Record<string, string> {
    const envContent = fs.readFileSync(filePath, "utf-8");

    const envVariables: Record<string, string> = {};

    envContent.split(/\r?\n/).forEach(element => {
      const remove_extra_space:string=element.trim();
      if (remove_extra_space && remove_extra_space.startsWith("#") ){
        return;
      } 

      const length_center:number=element.indexOf("=");
      let val:string=element.substring(0,length_center).trim();
      let key:string=element.substring(length_center+1).trim();
        envVariables[val] = key;
    });
    return envVariables;

  }

  static readCredentials(): Credentials {
    const envVariables = this.readenvFile();
    const username = envVariables[credentialEnvKeys.username];
    const password = envVariables[credentialEnvKeys.password];

    if (!username || !password) {
      throw new Error("Missing USERNAME or PASSWORD in the environment file");
    }

    return { username, password };
  }
}
