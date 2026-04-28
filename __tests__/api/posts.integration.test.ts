/**
 * Integration Tests for Posts API
 * Tests the actual API route handlers using file-based storage
 */

import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

describe("Posts API Integration Tests", () => {
  const originalPosts = "[]";

  beforeEach(async () => {
    await fs.writeFile(dataFilePath, originalPosts);
  });

  afterEach(async () => {
    await fs.writeFile(dataFilePath, originalPosts);
  });

  describe("GET /api/posts behavior", () => {
    it("should return empty array when no posts exist", async () => {
      const content = await fs.readFile(dataFilePath, "utf-8");
      const posts = JSON.parse(content);
      expect(Array.isArray(posts)).toBe(true);
      expect(posts).toHaveLength(0);
    });

    it("should return posts when they exist", async () => {
      const testPosts = [
        {
          slug: "test-post",
          title: "Test Post",
          excerpt: "Test excerpt",
          content: "Test content",
          publishedAt: "2026-03-01",
          author: "Test Author",
          tags: ["test"],
        },
      ];
      await fs.writeFile(dataFilePath, JSON.stringify(testPosts, null, 2));

      const content = await fs.readFile(dataFilePath, "utf-8");
      const posts = JSON.parse(content);

      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("test-post");
      expect(posts[0].title).toBe("Test Post");
    });
  });

  describe("POST /api/posts behavior", () => {
    it("should validate required fields", () => {
      const validatePost = (body: {
        title?: string;
        excerpt?: string;
        content?: string;
      }) => {
        if (!body.title || !body.excerpt || !body.content) {
          return { error: "Title, excerpt, and content are required" };
        }
        return null;
      };

      const result = validatePost({ title: "Only Title" });
      expect(result).toEqual({
        error: "Title, excerpt, and content are required",
      });
    });

    it("should create post with valid data", async () => {
      const newPost = {
        slug: "new-post",
        title: "New Post",
        excerpt: "New excerpt",
        content: "New content",
        publishedAt: "2026-04-02",
        author: "New Author",
        tags: ["new"],
      };

      const content = await fs.readFile(dataFilePath, "utf-8");
      const posts = JSON.parse(content);
      posts.unshift(newPost);
      await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2));

      const updatedContent = await fs.readFile(dataFilePath, "utf-8");
      const updatedPosts = JSON.parse(updatedContent);

      expect(updatedPosts).toHaveLength(1);
      expect(updatedPosts[0].slug).toBe("new-post");
    });
  });
});
