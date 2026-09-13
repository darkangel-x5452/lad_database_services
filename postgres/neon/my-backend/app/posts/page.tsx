import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Published posts</h1>
      <ul className="space-y-2">
        {allPosts.map((post) => (
          <li key={post.id} className="rounded border p-3">
            <p>{post.content}</p>
            <p className="mt-1 text-xs text-gray-500">by {post.author}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}