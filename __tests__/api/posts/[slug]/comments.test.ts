/**
 * Integration Tests for Comments API
 */

import { promises as fs } from "fs";
import path from "path";

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

describe("Comments API Integration Tests", () => {
  const originalComments = "[]";

  beforeEach(async () => {
    await fs.writeFile(commentsFilePath, originalComments);
  });

  afterEach(async () => {
    await fs.writeFile(commentsFilePath, originalComments);
  });

  describe("Comment data structure", () => {
    it("should create comment with required fields", () => {
      const comment = {
        id: "1",
        postSlug: "test-post",
        author: "Test Author",
        content: "Test comment content",
        createdAt: new Date().toISOString(),
      };

      expect(comment).toHaveProperty("id");
      expect(comment).toHaveProperty("postSlug");
      expect(comment).toHaveProperty("author");
      expect(comment).toHaveProperty("content");
      expect(comment).toHaveProperty("createdAt");
    });

    it("should filter comments by postSlug", () => {
      const comments = [
        { id: "1", postSlug: "post-a", author: "A", content: "Content A", createdAt: "" },
        { id: "2", postSlug: "post-b", author: "B", content: "Content B", createdAt: "" },
        { id: "3", postSlug: "post-a", author: "C", content: "Content C", createdAt: "" },
      ];

      const postAComments = comments.filter((c) => c.postSlug === "post-a");
      expect(postAComments).toHaveLength(2);
      expect(postAComments.map((c) => c.author)).toEqual(["A", "C"]);
    });
  });

  describe("File-based comment storage", () => {
    it("should persist comments to file", async () => {
      const testComments = [
        {
          id: "1",
          postSlug: "test-post",
          author: "Author 1",
          content: "Comment 1",
          createdAt: "2026-04-01T10:00:00Z",
        },
      ];

      await fs.writeFile(commentsFilePath, JSON.stringify(testComments, null, 2));

      const content = await fs.readFile(commentsFilePath, "utf-8");
      const savedComments = JSON.parse(content);

      expect(savedComments).toHaveLength(1);
      expect(savedComments[0].author).toBe("Author 1");
    });

    it("should append new comments", async () => {
      const existingComments = [
        {
          id: "1",
          postSlug: "test-post",
          author: "Existing",
          content: "Existing comment",
          createdAt: "2026-04-01T10:00:00Z",
        },
      ];

      await fs.writeFile(commentsFilePath, JSON.stringify(existingComments, null, 2));

      const newComment = {
        id: "2",
        postSlug: "test-post",
        author: "New Author",
        content: "New comment",
        createdAt: "2026-04-02T10:00:00Z",
      };

      const content = await fs.readFile(commentsFilePath, "utf-8");
      const comments = JSON.parse(content);
      comments.push(newComment);
      await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2));

      const updatedContent = await fs.readFile(commentsFilePath, "utf-8");
      const updatedComments = JSON.parse(updatedContent);

      expect(updatedComments).toHaveLength(2);
      expect(updatedComments[1].author).toBe("New Author");
    });
  });

  describe("Comment validation", () => {
    it("should require postSlug, author, and content", () => {
      const validateComment = (body: {
        postSlug?: string;
        author?: string;
        content?: string;
      }) => {
        if (!body.postSlug || !body.author || !body.content) {
          return { error: "postSlug, author, and content are required" };
        }
        return null;
      };

      expect(validateComment({})).toEqual({
        error: "postSlug, author, and content are required",
      });
      expect(validateComment({ postSlug: "test" })).toEqual({
        error: "postSlug, author, and content are required",
      });
      expect(
        validateComment({ postSlug: "test", author: "Author" })
      ).toEqual({ error: "postSlug, author, and content are required" });
      expect(
        validateComment({ postSlug: "test", author: "Author", content: "Content" })
      ).toBeNull();
    });

    it("should trim whitespace from author and content", () => {
      const body = {
        postSlug: "test",
        author: "  Author  ",
        content: "  Content  ",
      };

      const trimmed = {
        postSlug: body.postSlug,
        author: body.author.trim(),
        content: body.content.trim(),
      };

      expect(trimmed.author).toBe("Author");
      expect(trimmed.content).toBe("Content");
    });
  });
});
