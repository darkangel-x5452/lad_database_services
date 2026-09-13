import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';
import { neon } from '@neon/ai-sdk-provider';
import { streamText, generateText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

// Reused across requests. Use a pooled pg client, not the serverless driver.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
// Keep an idle disconnect from crashing the isolate.
attachDatabasePool(pool);

const app = new Hono();

// The assistant is called from the browser, so allow cross-origin requests.
app.use('/*', cors());

// One-shot generation: create a post from a topic and save it.
app.post('/generate', async (c) => {
  const { topic, author = 'anonymous' } = await c.req.json();

  const { text } = await generateText({
    model: neon('gpt-5-nano'),
    prompt: `Write a 2 sentence post about the following topic. Just send the post content without any additional text: ${topic}`,
  });

  const { rows } = await pool.query(
    'insert into posts (author, content, is_published) values ($1, $2, true) returning *',
    [author, text],
  );

  return c.json(rows[0]);
});

// Streaming assistant: answers questions about the posts, using a tool that
// queries Postgres. The tool loop runs in-process on Neon compute.
app.post('/assistant', async (c) => {
  const { messages } = await c.req.json();

  const result = streamText({
    model: neon('gpt-5-mini'),
    system:
      "You are a helpful assistant that answers questions about the user's blog posts. Use the queryPosts tool to look them up.",
    messages: await convertToModelMessages(messages),
    tools: {
      queryPosts: tool({
        description: 'Fetch the most recent published posts from the database.',
        inputSchema: z.object({
          limit: z.number().default(10).describe('How many posts to fetch.'),
        }),
        execute: async ({ limit }) => {
          const { rows } = await pool.query(
            'select author, content, created_at from posts where is_published = true order by created_at desc limit $1',
            [limit],
          );
          return rows;
        },
      }),
    },
    stopWhen: stepCountIs(5),
    // Disable telemetry: the function runtime's tracing conflicts with the
    // AI SDK's streaming spans.
    experimental_telemetry: { isEnabled: false },
  });

  return result.toUIMessageStreamResponse();
});

export default app;