'use client';

import { useActionState } from 'react';
import { generatePost } from './actions';

export default function GeneratePage() {
  const [state, formAction, isPending] = useActionState(generatePost, null);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Generate a post</h1>
      <form action={formAction} className="mb-4 flex gap-2">
        <input name="topic" placeholder="Topic" required className="rounded border px-2 py-1" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white"
        >
          {isPending ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.content && <p className="rounded border p-3">{state.content}</p>}
    </main>
  );
}