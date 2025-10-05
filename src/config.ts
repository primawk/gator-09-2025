import { Config } from "./types";
import { convertKeysToCamel, getConfigFilePath } from "./helper";
import { readFileSync, writeFileSync } from "node:fs";

export function setUser(name: string) {
  const file: Config = convertKeysToCamel(readConfig());
  file["currentUserName"] = name;
  writeFileSync(
    getConfigFilePath() + "/.gatorconfig.json",
    JSON.stringify(file)
  );
}

export function readConfig(): Config {
  const config: Config = JSON.parse(
    readFileSync(getConfigFilePath() + "/.gatorconfig.json", {
      encoding: "utf-8",
    })
  );
  return config;
}
