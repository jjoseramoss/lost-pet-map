import { inferPetAttrsFromImage } from "@/lib/ai/pet-attrs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { imageDataUrl?: string };
    if (!body.imageDataUrl) {
      return Response.json({ error: "Missing imageDataUrl" }, { status: 400 });
    }

    const result = await inferPetAttrsFromImage({ imageDataUrl: body.imageDataUrl });
    return Response.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
