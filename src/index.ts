import {
  addFeed,
  browse,
  feeds,
  fetchFeedHandler,
  follow,
  getAllUsersHandler,
  getFeedFollowsForUser,
  handlerAgg,
  handlerLogin,
  registerHandler,
  resetHandler,
  unfollowHandler,
} from "./handlers";
import { parseDuration } from "./helper";
import { middlewareLoggedIn } from "./middleware";
import { registerCommand, runCommand } from "./registerCommand";
import { CommandsRegistry } from "./types";
import { argv } from "node:process";

async function main() {
  let initObj: CommandsRegistry = {};
  registerCommand(initObj, "login", handlerLogin);
  registerCommand(initObj, "register", registerHandler);
  registerCommand(initObj, "reset", resetHandler);
  registerCommand(initObj, "users", getAllUsersHandler);
  registerCommand(initObj, "agg", handlerAgg);
  registerCommand(initObj, "addfeed", middlewareLoggedIn(addFeed));
  registerCommand(initObj, "feeds", feeds);
  registerCommand(initObj, "follow", middlewareLoggedIn(follow));
  registerCommand(
    initObj,
    "following",
    middlewareLoggedIn(getFeedFollowsForUser)
  );
  registerCommand(initObj, "unfollow", middlewareLoggedIn(unfollowHandler));
  registerCommand(initObj, "browse", browse);

  const cmds = argv.slice(2);
  const args = argv.slice(3);

  if (cmds.length === 0) {
    console.error("There is no command input.");
    process.exit(1);
  } else if (cmds[0] in initObj) {
    const response = await runCommand(initObj, cmds[0], ...args);
    return response;
  } else {
    console.error("The command is not registered.");
  }
  process.exit(0);
}

main();
