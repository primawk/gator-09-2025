import { CommandHandler, CommandsRegistry } from "./types";

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  console.log(registry[cmdName](cmdName, ...args));
}
