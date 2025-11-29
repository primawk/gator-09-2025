import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";

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

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function putFeedFetched(id: string) {
  await db
    .update(feeds)
    .set({ updatedAt: sql`NOW()`, lastFetchedAt: sql`NOW()` })
    .where(eq(feeds.id, id));
}
