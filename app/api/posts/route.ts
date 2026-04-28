import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const posts = JSON.parse(fileContent);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, author, tags } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = {
      slug,
      title,
      excerpt,
      content,
      publishedAt: new Date().toISOString().split("T")[0],
      author: author || "Anonymous",
      tags: tags || [],
    };

    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const posts = JSON.parse(fileContent);
    posts.unshift(newPost);
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2));

    // Revalidate the home page to show the new post
    revalidatePath("/");

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
