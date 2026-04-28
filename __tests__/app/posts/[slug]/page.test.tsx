/**
 * Unit Tests for Post Detail Page
 */

import { render } from "@testing-library/react";
import PostPage from "@/app/posts/[slug]/page";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";

jest.mock("@/lib/posts", () => ({
  getPostBySlug: jest.fn(),
  getAllSlugs: jest.fn(),
}));

const mockPost = {
  slug: "test-post",
  title: "Test Post Title",
  excerpt: "Test excerpt",
  content: `This is a test post.

## Section 1

Some content here.

## Section 2

More content here.`,
  publishedAt: "2026-03-15",
  author: "Test Author",
  tags: ["Test", "Unit"],
};

describe("PostPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render post title", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);
    (getAllSlugs as jest.Mock).mockResolvedValue(["test-post"]);

    const params = Promise.resolve({ slug: "test-post" });
    const { container } = render(await PostPage({ params }));

    expect(container.textContent).toContain("Test Post Title");
  });

  it("should render SSR indicator", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);
    (getAllSlugs as jest.Mock).mockResolvedValue(["test-post"]);

    const params = Promise.resolve({ slug: "test-post" });
    const { container } = render(await PostPage({ params }));

    expect(container.innerHTML).toContain("SSR");
  });

  it("should render back link", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);
    (getAllSlugs as jest.Mock).mockResolvedValue(["test-post"]);

    const params = Promise.resolve({ slug: "test-post" });
    const { container } = render(await PostPage({ params }));

    expect(container.textContent).toContain("Back to posts");
  });
});
