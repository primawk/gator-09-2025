import { setUser } from "./config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.error("username is required.");
    process.exit(1);
  }
  setUser(args[0]);
  console.log(`${args[0]} has been set as the user.`);
}
