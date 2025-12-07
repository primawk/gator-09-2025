import { db } from "..";
import { posts } from "../schema";
import { desc, eq } from "drizzle-orm";

export async function createPost(
  title: string,
  url: string,
  feedId: string,
  publishedAt: Date
) {
  const [result] = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      feedId: feedId,
      publishedAt: publishedAt,
    })
    .returning();
  return result;
}

export async function getPostsForUser(limit = 2) {
  const results = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return results;
}
