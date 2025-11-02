import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return result;
}

export async function readFeeds() {
  const result = await db
    .select({ name: feeds.name, url: feeds.url, userId: feeds.userId })
    .from(feeds);
  return result;
}
