import { User } from "./lib/db/schema";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandHandlerFetchFeed = (
  cmdName: string,
  ...args: string[]
) => Promise<MetaDatas>;

export type CommandsRegistry = Record<
  string,
  CommandHandler | CommandHandlerFetchFeed
>;

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type MetaDatas = {
  metadata: {
    title: string;
    link: string;
    description: string;
  };
  items: RSSItem[];
};

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type middlewareLoggedIn = (
  handler: UserCommandHandler
) => CommandHandler | CommandHandlerFetchFeed;
