import { NextRequest, NextResponse } from "next/server";

// In production, this would connect to your database (MongoDB, PostgreSQL, etc.)
// For now, we'll use in-memory storage (resets on server restart)
let articles: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // Return all articles with both language versions
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json();

    // Validate required fields
    if (!articleData.title || !articleData.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create new article with bilingual support
    const newArticle = {
      id: articles.length + 1,
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articles.push(newArticle);

    // In production, save to database:
    // await db.collection('articles').insertOne(newArticle);

    return NextResponse.json({
      success: true,
      article: newArticle,
      message: "Article created successfully with bilingual support",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const articleData = await request.json();

    if (!articleData.id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const index = articles.findIndex((a) => a.id === articleData.id);

    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    articles[index] = {
      ...articles[index],
      ...articleData,
      updatedAt: new Date().toISOString(),
    };

    // In production, update in database:
    // await db.collection('articles').updateOne(
    //   { id: articleData.id },
    //   { $set: { ...articleData, updatedAt: new Date() } }
    // );

    return NextResponse.json({
      success: true,
      article: articles[index],
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    articles = articles.filter((a) => a.id !== parseInt(id));

    // In production, delete from database:
    // await db.collection('articles').deleteOne({ id: parseInt(id) });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
