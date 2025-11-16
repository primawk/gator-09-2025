import { userInfo } from "os";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import {
  CommandHandler,
  CommandHandlerFetchFeed,
  middlewareLoggedIn,
  UserCommandHandler,
} from "./types";

export function middlewareLoggedIn(handler: UserCommandHandler) {
  return async (cmdName: string, ...args: string[]) => {
    try {
      const responseCurrentUser = await getUser(readConfig().currentUserName);
      if (!responseCurrentUser)
        throw new Error(`User ${readConfig().currentUserName} not found`);

      return handler(cmdName, responseCurrentUser, ...args);
    } catch (error) {
      console.error(`🔴 Error from middleware login:`, error);
      process.exit(1);
    }
  };
}
