import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  // branch policy omitted for brevity; keep the one from `neon config init`
  preview: {
    aiGateway: true,
    buckets: {
      images: { access: 'public_read' },
    },
    functions: {
      posts: { name: 'posts assistant', source: './functions/posts.ts' },
    },
  },
});

// import { defineConfig } from '@neon/config/v1';

// export default defineConfig({
//   // branch policy omitted for brevity; keep the one from `neon config init`
//   preview: {
//     buckets: {
//       images: { access: 'public_read' },
//     },
//   },
// });

// import { defineConfig } from "@neon/config/v1";

// export default defineConfig({
//   // Services: what exists on every branch
//   auth: true,

//   // Branch policy: per-branch tuning
//   branch: (branch) => {
//     if (branch.isDefault) {
//       // Default branch: no overrides, uses project defaults
//       return {};
//     }
//     if (!branch.exists) {
//       // New non-default branches: auto-expire
//       return { ttl: "7d" };
//     }
//     // Existing branch: no changes
//     return {};
//   },
// });