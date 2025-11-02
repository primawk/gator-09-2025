import {
  CommandHandler,
  CommandHandlerFetchFeed,
  CommandsRegistry,
} from "./types";

export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler | CommandHandlerFetchFeed
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  registry[cmdName](cmdName, ...args);
}
