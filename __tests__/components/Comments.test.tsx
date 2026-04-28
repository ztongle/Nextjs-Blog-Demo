/**
 * Unit Tests for Comments Component
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Comments from "@/components/Comments";

const mockComments = [
  {
    id: "1",
    postSlug: "test-post",
    author: "Alice",
    content: "Great post!",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "2",
    postSlug: "test-post",
    author: "Bob",
    content: "Very helpful, thanks!",
    createdAt: "2026-04-02T14:30:00Z",
  },
];

describe("Comments Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should render comment form", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<Comments postSlug="test-post" />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /post comment/i })).toBeInTheDocument();
  });

  it("should display loading state initially", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Comments postSlug="test-post" />);

    expect(screen.getByText(/loading comments/i)).toBeInTheDocument();
  });

  it("should display empty state when no comments", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    });
  });

  it("should display comments when loaded", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockComments),
    });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Great post!")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Very helpful, thanks!")).toBeInTheDocument();
    });
  });

  it("should post new comment successfully", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "3",
            postSlug: "test-post",
            author: "Charlie",
            content: "New comment",
            createdAt: "2026-04-03T09:00:00Z",
          }),
      });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/name/i), "Charlie");
    await userEvent.type(screen.getByLabelText(/comment/i), "New comment");
    await userEvent.click(screen.getByRole("button", { name: /post comment/i }));

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
      expect(screen.getByText("New comment")).toBeInTheDocument();
    });
  });

  it("should clear form after successful submission", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "3",
            postSlug: "test-post",
            author: "Test",
            content: "Test content",
            createdAt: "2026-04-03T09:00:00Z",
          }),
      });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => screen.getByLabelText(/name/i));

    await userEvent.type(screen.getByLabelText(/name/i), "Test");
    await userEvent.type(screen.getByLabelText(/comment/i), "Test content");
    await userEvent.click(screen.getByRole("button", { name: /post comment/i }));

    await waitFor(() => {
      expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe("");
      expect((screen.getByLabelText(/comment/i) as HTMLTextAreaElement).value).toBe("");
    });
  });

  it("should show error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load comments/i)).toBeInTheDocument();
    });
  });

  it("should show error message on post failure", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to create comment" }),
      });

    render(<Comments postSlug="test-post" />);

    await waitFor(() => screen.getByLabelText(/name/i));

    await userEvent.type(screen.getByLabelText(/name/i), "Test");
    await userEvent.type(screen.getByLabelText(/comment/i), "Test content");
    await userEvent.click(screen.getByRole("button", { name: /post comment/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create comment/i)).toBeInTheDocument();
    });
  });
});
