import {generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";


const suggestionSchema = z.object({
    suggestion : z
        .string()
        .describe(
            "The code to insert at cursor, or empty string if no completion needed"
        ),
});

const SUGGESTION_PROMPT = `You are an inline code completion assistant for an IDE. Your task is to suggest the exact code/characters to insert at the cursor position.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these evaluation steps IN ORDER:

1. Check <next_lines> and <after_cursor>. If the code to be typed is already written immediately after the cursor, return nothing (empty response).
2. Check <before_cursor>. If <before_cursor> already forms a complete expression and no natural completion (like chaining, arguments, or block continuation) makes sense, return nothing.
3. If steps 1 and 2 do not apply: suggest ONLY the exact code/characters that should be inserted directly at the cursor position using <full_code> as context.

CRITICAL OUTPUT RULES:
- Return ONLY the raw code to be inserted.
- DO NOT wrap output in markdown code blocks (no \`\`\` code fences).
- DO NOT include explanations, comments, or conversational text.
- If no completion is needed, return absolute empty output (0 characters).
</instructions>`;


export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const prompt = SUGGESTION_PROMPT
      .replace("{fileName}", fileName)
      .replace("{code}", code)
      .replace("{currentLine}", currentLine)
      .replace("{previousLines}", previousLines || "")
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{nextLines}", nextLines || "")
      .replace("{lineNumber}", lineNumber.toString());

    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: suggestionSchema }),
      prompt,
    });

    return NextResponse.json({ suggestion: output.suggestion })
  } catch (error) {
    console.error("Suggestion error: ", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 },
    );
  }
}