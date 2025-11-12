import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  // 2. Fetch the inserted row with joined data
  const [resultFeed] = await db
    .select({
      feed: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  const [resultUser] = await db
    .select({
      username: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return { newFeedFollow, resultFeed, resultUser };
}

export async function getFeedFollowsByUser(userId: string) {
  const result = await db
    .select({
      feed: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.userId, userId));

  return result;
}
