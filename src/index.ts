import { readConfig, setUser } from "./config";
import { handlerLogin } from "./loginHandler";
import { registerCommand, runCommand } from "./registerCommand";
import { CommandsRegistry } from "./types";
import { argv } from "node:process";

async function main() {
  let initObj: CommandsRegistry = {};
  registerCommand(initObj, "login", handlerLogin);

  const cmds = argv.slice(2);
  if (cmds.length === 0) {
    console.error("There is no command input.");
    process.exit(1);
  }
  cmds.forEach((cmd) => {
    if (cmd in initObj) {
      const args = argv.slice(3);
      runCommand(initObj, cmd, ...args);
    }
  });
  // readConfig();
  process.exit(0);
}

main();
