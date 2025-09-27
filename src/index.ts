import { handlerLogin, registerHandler } from "./handlers";
import { registerCommand, runCommand } from "./registerCommand";
import { CommandsRegistry } from "./types";
import { argv } from "node:process";

async function main() {
  let initObj: CommandsRegistry = {};
  registerCommand(initObj, "login", handlerLogin);
  registerCommand(initObj, "register", registerHandler);

  const cmds = argv.slice(2);
  const args = argv.slice(3);
  if (cmds.length === 0) {
    console.error("There is no command input.");
    process.exit(1);
  }

  if (cmds[0] in initObj) {
    runCommand(initObj, cmds[0], ...args);
  } else {
    console.error("The command is not registered.");
    process.exit(1);
  }
}

main();
