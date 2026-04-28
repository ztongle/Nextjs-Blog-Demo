import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
}

async function readComments(): Promise<Comment[]> {
  try {
    const fileContent = await fs.readFile(commentsFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

async function writeComments(comments: Comment[]): Promise<void> {
  await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
  }

  const comments = await readComments();
  const postComments = comments.filter((c) => c.postSlug === postSlug);
  return NextResponse.json(postComments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postSlug, author, content } = body;

    if (!postSlug || !author || !content) {
      return NextResponse.json(
        { error: "postSlug, author, and content are required" },
        { status: 400 }
      );
    }

    const comments = await readComments();
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      postSlug,
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    await writeComments(comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
