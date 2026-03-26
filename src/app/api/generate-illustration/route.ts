import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

type Provider = "gemini" | "openai";

async function generateWithGemini(prompt: string): Promise<{ image: string; text: string | null }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  let imageData: string | null = null;
  let textResponse: string | null = null;

  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/")) {
      imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    if (part.text) textResponse = part.text;
  }

  if (!imageData) throw new Error("Gemini returned no image");
  return { image: imageData, text: textResponse };
}

async function generateWithOpenAI(prompt: string): Promise<{ image: string; text: string | null }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key not configured");

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  const revised = data.data?.[0]?.revised_prompt || null;

  if (!b64) throw new Error("OpenAI returned no image");
  return { image: `data:image/png;base64,${b64}`, text: revised };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider: requestedProvider } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const provider: Provider = requestedProvider === "openai" ? "openai" : "gemini";
    const fallback: Provider = provider === "gemini" ? "openai" : "gemini";

    // Try primary provider, fall back to the other
    try {
      const result = provider === "gemini"
        ? await generateWithGemini(prompt)
        : await generateWithOpenAI(prompt);
      return NextResponse.json({ ...result, provider });
    } catch (primaryError: unknown) {
      const msg = primaryError instanceof Error ? primaryError.message : String(primaryError);
      console.error(`${provider} failed:`, msg);

      // Fallback
      try {
        const result = fallback === "gemini"
          ? await generateWithGemini(prompt)
          : await generateWithOpenAI(prompt);
        return NextResponse.json({ ...result, provider: fallback, fallbackFrom: provider });
      } catch (fallbackError: unknown) {
        const fbMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        console.error(`${fallback} also failed:`, fbMsg);
        return NextResponse.json(
          { error: `Both providers failed. ${provider}: ${msg}. ${fallback}: ${fbMsg}` },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Generate illustration error:", error);
    return NextResponse.json({ error: "Failed to generate illustration" }, { status: 500 });
  }
}
