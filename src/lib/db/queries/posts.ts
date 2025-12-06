import { db } from "..";
import { posts } from "../schema";

export async function createPost(title: string, url: string, feedId: string) {
  const [result] = await db
    .insert(posts)
    .values({ title: title, url: url, feedId: feedId })
    .returning();
  return result;
}
