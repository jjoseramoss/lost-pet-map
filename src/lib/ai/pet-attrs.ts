export type AiPetAttrs = {
  species: "dog" | "cat" | "other";
  breed: string | null;
  color: string | null;
};

export function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL_PET_ATTRS || "gpt-5.2";

  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  return { apiKey, baseUrl, model };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return match[0];
}

export async function inferPetAttrsFromImage(params: { imageDataUrl: string }) {
  const { apiKey, baseUrl, model } = getOpenAiConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a classifier that extracts pet attributes from an image. Reply with ONLY valid JSON.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "Look at the photo and infer the following fields:",
                "- species: one of dog, cat, other",
                "- breed: a short breed guess if possible, otherwise null",
                "- color: short color description (e.g., black/tan, gray tabby), otherwise null",
                "Return ONLY JSON in this exact shape:",
                '{"species":"dog","breed":"Husky","color":"gray/white"}',
              ].join("\n"),
            },
            { type: "image_url", image_url: { url: params.imageDataUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");

  const jsonText = extractJson(content);
  if (!jsonText) throw new Error("OpenAI response was not valid JSON");

  const parsed = JSON.parse(jsonText) as Partial<AiPetAttrs>;
  const species = parsed.species;

  if (species !== "dog" && species !== "cat" && species !== "other") {
    throw new Error("Invalid species returned by AI");
  }

  return {
    species,
    breed: parsed.breed && String(parsed.breed).trim().length > 0 ? String(parsed.breed).trim() : null,
    color: parsed.color && String(parsed.color).trim().length > 0 ? String(parsed.color).trim() : null,
  } satisfies AiPetAttrs;
}
