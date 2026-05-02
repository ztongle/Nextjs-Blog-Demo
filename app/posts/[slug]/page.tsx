import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import Comments from "@/components/Comments";

// SSR: Dynamic rendering - no cache, fresh on every request
// This is the default when not using revalidate or force-dynamic
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Format content - split by newlines and render paragraphs
  const paragraphs = post.content.trim().split("\n\n");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to posts
          </Link>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            SSR • Fresh on every request
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Rendered at: {new Date().toISOString()}
          </span>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {post.title}
            </h1>
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
          </header>

          <div className="max-w-none">
            {paragraphs.map((para, i) => {
              // Check if it's a heading
              if (para.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
                  >
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("# ")) {
                return (
                  <h1
                    key={i}
                    className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
                  >
                    {para.replace("# ", "")}
                  </h1>
                );
              }
              // Check if it's a code block
              if (para.includes("```")) {
                return (
                  <pre
                    key={i}
                    className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100"
                  >
                    <code>{para.replace(/```\w*\n?/g, "")}</code>
                  </pre>
                );
              }
              // Check if it's a table
              if (para.includes("|")) {
                return (
                  <div key={i} className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                      <tbody>
                        {para.split("\n").map((row, j) => {
                          if (
                            row.trim().startsWith("|") &&
                            row.trim().endsWith("|")
                          ) {
                            const cells = row
                              .split("|")
                              .filter((c) => c.trim());
                            return (
                              <tr key={j}>
                                {cells.map((cell, k) => (
                                  <td
                                    key={k}
                                    className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                                  >
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            );
                          }
                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              // Check if it's a list item
              if (para.startsWith("- ") || para.match(/^\d+\. /)) {
                const items = para.split("\n").filter((line) => line.trim());
                const isOrdered = para.match(/^\d+\. /);
                const ListTag = isOrdered ? "ol" : "ul";
                return (
                  <ListTag
                    key={i}
                    className="mt-4 list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-300"
                  >
                    {items.map((item, j) => (
                      <li key={j}>
                        {item.replace(/^[-*\d]+\. /, "").replace(/\*\*/g, "")}
                      </li>
                    ))}
                  </ListTag>
                );
              }
              // Regular paragraph
              return (
                <p key={i} className="mt-4 text-zinc-700 dark:text-zinc-300">
                  {para}
                </p>
              );
            })}
          </div>
        </article>

        {/* Comments Section */}
        <Comments postSlug={post.slug} />

        {/* Refresh hint for demonstrating SSR */}
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <strong>Try this:</strong> Refresh this page and watch the timestamp
          change. This page is rendered fresh on every request (SSR).
        </div>
      </main>
    </div>
  );
}
