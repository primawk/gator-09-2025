import { readConfig, setUser } from "./config";

function main() {
  setUser("Prima");
  readConfig();
}

main();
