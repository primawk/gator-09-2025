import { XMLParser } from "fast-xml-parser";
import { readConfig, setUser } from "./config";
import {
  createUser,
  deleteAllUsers,
  getUser,
  getUserById,
  getUsers,
} from "./lib/db/queries/users";
import { MetaDatas, RSSFeed, RSSItem } from "./types";
import { printFeed } from "./helper";
import {
  createFeed,
  getFeedByUrl,
  putFeedFetched,
  readFeeds,
} from "./lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsByUser,
} from "./lib/db/queries/feedFollows";
import { User } from "./lib/db/schema";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.error("username is required.");
    process.exit(1);
  }

  try {
    const response = await getUser(args[0]);
    if (!response?.name) {
      throw Error("user does not exist!");
    }
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }

  setUser(args[0]);
  console.log(`${args[0]} has been set as the user.`);
  process.exit(0);
}

export async function registerHandler(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw Error("name is required.");
  }

  try {
    const response = await getUser(args[0]);
    if (response?.name === args[0]) {
      throw Error("name is already exist");
    }
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }

  try {
    const result = await createUser(args[0]);
    console.log(`User has been registered: ${result.name}`);
  } catch (err) {
    console.error(`🔴 Error from ${cmdName}:`, err);
    process.exit(1);
  }

  try {
    setUser(args[0]);
    console.log("user has been created!", readConfig());
    process.exit(0);
  } catch (error) {
    console.error("🔴 Error from setUser:", error);
    process.exit(1);
  }
}

export async function resetHandler() {
  try {
    await deleteAllUsers();
    console.log("all users data has been deleted!");
    process.exit(0);
  } catch (error) {
    console.error("🔴 Error from reset:", error);
    process.exit(1);
  }
}

export async function getAllUsersHandler() {
  const currentUser = readConfig().currentUserName;
  try {
    const response = await getUsers();

    response.forEach((user: { name: string }) => {
      if (user.name === currentUser) {
        console.log(`* ${user.name} (current)`);
      } else {
        console.log(`* ${user.name}`);
      }
    });
    process.exit(0);
  } catch (error) {
    console.error("🔴 Error from getAllUsers:", error);
    process.exit(1);
  }
}

export async function fetchFeedHandler(feedURL: string): Promise<MetaDatas> {
  try {
    const response = await fetch(feedURL, {
      headers: {
        "User-Agent": "gator",
      },
    });
    const result = await response.text();

    const parser = new XMLParser();
    let jObj = parser.parse(result);
    const rssFeed: RSSFeed = jObj.rss;

    if (!rssFeed.channel) throw Error("channel does not exist!");
    if (
      !rssFeed.channel.title ||
      !rssFeed.channel.description ||
      !rssFeed.channel.link
    )
      throw Error("there are metadatas missing!");
    const metadata = {
      title: rssFeed.channel.title,
      link: rssFeed.channel.link,
      description: rssFeed.channel.description,
    };
    if (!Array.isArray(rssFeed.channel.item)) rssFeed.channel.item = [];

    const cleanedItems: RSSItem[] = rssFeed.channel.item.map(
      ({ title, link, description, pubDate }) => ({
        title,
        link,
        description,
        pubDate,
      })
    );

    return {
      metadata: metadata,
      items: cleanedItems,
    };
  } catch (error) {
    console.error("🔴 Error from fetchFeed:", error);
    process.exit(1);
  }
}

export async function addFeed(cmdName: string, user: User, ...args: string[]) {
  const name = args[0];
  const url = args[1];

  if (!name || !url) throw Error("arguments is missing!");

  try {
    const responseFetchFeed = await fetchFeedHandler(url);
    if (responseFetchFeed) {
      const storeFeed = await createFeed(name, url, user.id);

      if (!user?.name) {
        throw Error("user does not exist!");
      }
      printFeed(storeFeed, user);
    }
    console.log("Feed has has been stored.");

    const responseFollow = await follow("follow", user, url);
    console.log({ responseFollow });
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }
}

export async function feeds(cmdName: string) {
  try {
    const response = await readFeeds();

    let result: {
      name: string;
      url: string;
      userId: string;
      username: string;
    }[] = [];

    for (let i = 0; i < response?.length; i++) {
      try {
        const responseUserDetails = await getUserById(response[i].userId);
        const username = responseUserDetails.name;
        result.push({ ...response[i], username });
      } catch (error) {
        console.error(
          `🔴 Error from fetching ${response[i].userId} user id:`,
          error
        );
      }
    }
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }
}

export async function follow(cmdName: string, user: User, url: string) {
  try {
    const responseFeedByUrl = await getFeedByUrl(url);
    console.log({ responseFeedByUrl });

    if (user && responseFeedByUrl) {
      const followResponse = await createFeedFollow(
        user.id,
        responseFeedByUrl.id
      );

      console.log({ followResponse });
    }
    process.exit(0);
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }
}

export async function getFeedFollowsForUser(cmdName: string, user: User) {
  try {
    const responseFeedFollowsByUser = await getFeedFollowsByUser(user.id);

    console.log(
      responseFeedFollowsByUser?.map((item) => `- ${item.feed}`).join("\n")
    );

    process.exit(0);
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }
}

export async function unfollowHandler(
  cmdName: string,
  user: User,
  url: string
) {
  if (!url) throw Error("url is missing!");
  try {
    await deleteFeedFollow(user.id, url);
    console.log("feed has been unfollowed!");
    process.exit(0);
  } catch (error) {
    console.error(`🔴 Error from ${cmdName}:`, error);
    process.exit(1);
  }
}

export async function markFeedFetched(id: string) {
  if (!id) throw Error("feed id is missing!");
  try {
    await putFeedFetched(id);
    process.exit(0);
  } catch (error) {
    console.error(`🔴 Error from marked feed for id ${id}:`, error);
    process.exit(1);
  }
}

export async function getNextFeedToFetch() {
  try {
    const response = await readFeeds();
    console.log({ response });
  } catch (error) {}
}

export async function scrapeFeeds() {
  try {
    const response = await getNextFeedToFetch();
    console.log({ response });
  } catch (error) {}
}
