'use client';

import { useActionState } from 'react';
import { uploadImage } from './actions';

export default function UploadPage() {
  const [state, formAction, isPending] = useActionState(uploadImage, null);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Upload an image</h1>
      <form action={formAction} className="mb-4">
        <input name="file" type="file" accept="image/*" required />
        <button
          type="submit"
          disabled={isPending}
          className="mt-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.publicUrl && (
        <p className="text-sm text-gray-500 break-all">Uploaded: {state.publicUrl}</p>
      )}
    </main>
  );
}