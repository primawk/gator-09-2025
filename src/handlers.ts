import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.error("username is required.");
    process.exit(1);
  }
  setUser(args[0]);
  console.log(`${args[0]} has been set as the user.`);
}

export async function registerHandler(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.error("name is required.");
    process.exit(1);
  }
  const existingUser = getUser(args[0]);
  console.log({ existingUser });
}
