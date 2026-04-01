export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
}

// Mock blog posts
const posts: Post[] = [
  {
    slug: "understanding-ssr",
    title: "Understanding Server-Side Rendering (SSR)",
    excerpt: "Learn how SSR works in Next.js and why it improves initial page load performance.",
    content: `
Server-Side Rendering (SSR) is a technique where HTML is generated on the server for each request, rather than on the client.

## How SSR Works in Next.js

In Next.js App Router, components are Server Components by default. When a page is requested:

1. The server receives the request
2. React renders the component tree on the server
3. HTML is generated and sent to the client
4. The page becomes interactive (hydration)

## Benefits of SSR

- **Faster First Contentful Paint** - HTML arrives pre-rendered
- **Better SEO** - Search engines can index the content immediately
- **Improved Performance on Low-end Devices** - Less JavaScript to parse

## When to Use SSR

Use SSR when you need:
- Dynamic content that changes per request
- Content that requires authentication before viewing
- Frequently changing data that shouldn't be cached
    `,
    publishedAt: "2026-03-01",
    author: "Alice Developer",
    tags: ["SSR", "Next.js", "Performance"],
  },
  {
    slug: "mastering-isr",
    title: "Mastering Incremental Static Regeneration (ISR)",
    excerpt: "ISR lets you use static generation for most pages while regenerating them in the background when data changes.",
    content: `
Incremental Static Regeneration (ISR) combines the benefits of static generation with the ability to update content without rebuilding your entire site.

## How ISR Works

By adding a \`revalidate\` export to your page, Next.js will:

1. Serve the statically generated page from cache
2. In the background, regenerate the page if it's stale
3. Serve the new version to subsequent visitors

## The revalidate Option

\`\`\`typescript
export const revalidate = 60; // Revalidate every 60 seconds
\`\`\`

This means:
- First visitor gets a freshly generated page
- Next 60 seconds: served from cache (fast!)
- After 60 seconds: next visitor triggers regeneration

## Use Cases for ISR

- **Blogs & Content Sites** - Content changes but not in real-time
- **E-commerce Product Pages** - Inventory updates periodically
- **Documentation** - Updates don't need to be instant

## On-Demand Revalidation

You can also trigger revalidation programmatically using \`revalidatePath\` or \`revalidateTag\` when content changes.
    `,
    publishedAt: "2026-03-15",
    author: "Bob Engineer",
    tags: ["ISR", "Next.js", "Caching"],
  },
  {
    slug: "ssr-vs-isr",
    title: "SSR vs ISR: Choosing the Right Strategy",
    excerpt: "A practical guide to choosing between SSR and ISR based on your content patterns.",
    content: `
Choosing between SSR and ISR depends on your content's characteristics and update patterns.

## Quick Comparison

| Feature | SSR | ISR |
|---------|-----|-----|
| Freshness | Always fresh | Stale-while-revalidate |
| Performance | Slower (per request) | Fast (cached) |
| Scalability | Server compute per request | Static cache |
| Use Case | Real-time data | Periodic updates |

## Decision Framework

**Choose SSR when:**
- Content is user-specific (personalized feeds)
- Data changes in real-time (stock prices, live scores)
- Content depends on authentication
- SEO is critical AND content changes frequently

**Choose ISR when:**
- Content is the same for all users
- Updates happen periodically (blog posts, products)
- You want the best performance
- Content freshness within minutes is acceptable

## Hybrid Approaches

Next.js allows you to mix strategies:
- Use ISR for most pages
- Use SSR only for pages that truly need it
- Use Client Components for truly dynamic parts

## Cache Invalidation

Both approaches respect cache headers, but ISR gives you more control with:
- \`revalidate\` for time-based invalidation
- \`revalidatePath\` for on-demand invalidation
- Cache tags for granular control
    `,
    publishedAt: "2026-03-20",
    author: "Carol Tech",
    tags: ["SSR", "ISR", "Architecture"],
  },
];

export async function getAllPosts(): Promise<Post[]> {
  // Simulate network delay to demonstrate ISR behavior
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Try to read dynamically added posts
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataFilePath = path.join(process.cwd(), "data", "posts.json");
    const fileContent = await fs.promises.readFile(dataFilePath, "utf-8");
    const dynamicPosts: Post[] = JSON.parse(fileContent);
    return [...dynamicPosts, ...posts];
  } catch {
    return posts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Check dynamic posts first
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataFilePath = path.join(process.cwd(), "data", "posts.json");
    const fileContent = await fs.promises.readFile(dataFilePath, "utf-8");
    const dynamicPosts: Post[] = JSON.parse(fileContent);
    const found = dynamicPosts.find((post) => post.slug === slug);
    if (found) return found;
  } catch {
    // Continue to static posts
  }

  return posts.find((post) => post.slug === slug) || null;
}

export async function getAllSlugs(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Include dynamic posts
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataFilePath = path.join(process.cwd(), "data", "posts.json");
    const fileContent = await fs.promises.readFile(dataFilePath, "utf-8");
    const dynamicPosts: Post[] = JSON.parse(fileContent);
    return [...dynamicPosts.map((p) => p.slug), ...posts.map((p) => p.slug)];
  } catch {
    return posts.map((post) => post.slug);
  }
}
