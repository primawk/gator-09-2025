import { db } from "..";
import { posts } from "../schema";
import { desc, eq } from "drizzle-orm";

export async function createPost(title: string, url: string, feedId: string) {
  const [result] = await db
    .insert(posts)
    .values({ title: title, url: url, feedId: feedId })
    .returning();
  return result;
}

export async function getPostsForUser(feedId: string, limit = 2) {
  const results = await db
    .select()
    .from(posts)
    .where(eq(posts.feedId, feedId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return results;
}
