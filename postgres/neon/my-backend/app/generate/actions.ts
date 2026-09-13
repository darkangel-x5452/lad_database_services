'use server';

export async function generatePost(
  _prev: { error?: string; content?: string } | null,
  formData: FormData,
) {
  const topic = formData.get('topic') as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_POSTS_FN_URL}generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, author: 'anonymous' }),
  });

  if (!res.ok) return { error: 'Generation failed' };
  const post = await res.json();
  return { content: post.content as string };
}