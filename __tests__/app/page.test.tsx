/**
 * Unit Tests for Home Page
 */

import { render } from "@testing-library/react";
import HomePage from "@/app/page";
import { getAllPosts } from "@/lib/posts";

jest.mock("@/lib/posts", () => ({
  getAllPosts: jest.fn(),
}));

const mockPosts = [
  {
    slug: "test-post-1",
    title: "Test Post 1",
    excerpt: "This is test post 1",
    content: "Content 1",
    publishedAt: "2026-03-01",
    author: "Test Author",
    tags: ["Test"],
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    excerpt: "This is test post 2",
    content: "Content 2",
    publishedAt: "2026-03-02",
    author: "Test Author 2",
    tags: ["Test", "Next.js"],
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the page title", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    const { container } = render(await HomePage());
    expect(container.textContent).toContain("Next.js Blog");
  });

  it("should display ISR indicator", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    const { container } = render(await HomePage());
    expect(container.innerHTML).toContain("ISR");
  });

  it("should render all posts", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    const { container } = render(await HomePage());
    expect(container.textContent).toContain("Test Post 1");
    expect(container.textContent).toContain("Test Post 2");
  });

  it("should render post metadata", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    const { container } = render(await HomePage());
    expect(container.textContent).toContain("2026-03-01");
    expect(container.textContent).toContain("Test Author");
  });
});
