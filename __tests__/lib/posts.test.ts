/**
 * Unit Tests for posts.ts utility functions
 */

import { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/posts";

describe("posts utility functions", () => {
  describe("getAllPosts", () => {
    it("should return an array of posts", async () => {
      const posts = await getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
    });

    it("should return posts with required fields", async () => {
      const posts = await getAllPosts();
      if (posts.length > 0) {
        const post = posts[0];
        expect(post).toHaveProperty("slug");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("excerpt");
        expect(post).toHaveProperty("content");
        expect(post).toHaveProperty("publishedAt");
        expect(post).toHaveProperty("author");
        expect(post).toHaveProperty("tags");
      }
    });

    it("should include static blog posts", async () => {
      const posts = await getAllPosts();
      const slugs = posts.map((p) => p.slug);
      expect(slugs).toContain("understanding-ssr");
      expect(slugs).toContain("mastering-isr");
      expect(slugs).toContain("ssr-vs-isr");
    });
  });

  describe("getPostBySlug", () => {
    it("should return a post when given a valid slug", async () => {
      const post = await getPostBySlug("understanding-ssr");
      expect(post).not.toBeNull();
      expect(post?.slug).toBe("understanding-ssr");
    });

    it("should return null when given an invalid slug", async () => {
      const post = await getPostBySlug("non-existent-post");
      expect(post).toBeNull();
    });
  });

  describe("getAllSlugs", () => {
    it("should return an array of slugs", async () => {
      const slugs = await getAllSlugs();
      expect(Array.isArray(slugs)).toBe(true);
    });

    it("should return unique slugs", async () => {
      const slugs = await getAllSlugs();
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });
  });
});
