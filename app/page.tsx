import { getAllPosts } from "@/lib/posts";
import Article from "@/components/Article";

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
            <Article key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
