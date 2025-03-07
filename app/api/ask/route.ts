import { askGemini } from "@/lib/Gemini"; // Adjust path as needed
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid Query!" },
        { status: 400 }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of askGemini(query)) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.enqueue(
            new TextEncoder().encode(
              `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
          controller.close();
        }
      },
    });

    // Return the stream as the response
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}