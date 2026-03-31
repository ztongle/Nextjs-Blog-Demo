import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

// ISR: Revalidate every 60 seconds
// This page is statically generated but regenerates in the background
export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Next.js Blog
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            SSR / ISR Learning Demo
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            ISR • Revalidates every 60s
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page built at: {new Date().toISOString()}
          </span>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700"
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-600">→</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                  <span>•</span>
                  <span>{post.author}</span>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
