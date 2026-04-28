import Link from "next/link";
import type { Post } from "@/lib/posts";

interface ArticleProps {
  post: Post;
}

export default function Article({ post }: ArticleProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 hover:dark:border-zinc-700">
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
  );
}
