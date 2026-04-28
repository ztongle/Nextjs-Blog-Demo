/**
 * End-to-End Tests for Blog Application
 */

import { test, expect } from "@playwright/test";

test.describe("Blog Application E2E Tests", () => {
  test("should load home page and display posts", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Next.js Blog/);

    // Check header is visible
    await expect(page.locator("h1")).toContainText("Next.js Blog");

    // Check ISR indicator
    await expect(page.getByText(/ISR/)).toBeVisible();

    // Check at least one post is displayed
    await expect(
      page.getByText("Understanding Server-Side Rendering"),
    ).toBeVisible();
  });

  test("should navigate to post detail page", async ({ page }) => {
    await page.goto("/");

    // Click on first post
    await page.getByText("Understanding Server-Side Rendering").click();

    // Check SSR indicator on post page
    await expect(page.getByText(/SSR/)).toBeVisible();

    // Check post title is displayed
    await expect(page.locator("h1")).toContainText(
      "Understanding Server-Side Rendering",
    );

    // Check back link exists
    await expect(page.getByText("← Back to posts")).toBeVisible();
  });

  test("should navigate back to home from post page", async ({ page }) => {
    await page.goto("/posts/understanding-ssr");

    // Click back link
    await page.getByText("← Back to posts").click();

    // Verify we're back on home page
    await expect(page.locator("h1")).toContainText("Next.js Blog");
  });
});
