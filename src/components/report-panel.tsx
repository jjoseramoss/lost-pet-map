import Image from "next/image";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import logo from "@/app/projectLogo.png";
import PanelShell from "@/components/panel-shell";
import PhotoField from "@/components/report/photo-field";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getPublicStorageUrl } from "@/lib/storage/public-url";
import type { PostType, Species } from "@/lib/posts/types";

type ReportPanelProps = {
  onClose: () => void;
  lat: string;
  lng: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onStartPickLocation: () => void;
  hidden?: boolean;
};

const photoBucket = "pet-photos";

export default function ReportPanel({
  onClose,
  lat,
  lng,
  onLatChange,
  onLngChange,
  onStartPickLocation,
  hidden,
}: ReportPanelProps) {
  const [species, setSpecies] = useState<Species>("dog");
  const [postType, setPostType] = useState<PostType>("lost");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasDeviceLocation, setHasDeviceLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasDeviceLocation(true);
        onLatChange(lat || String(position.coords.latitude));
        onLngChange(lng || String(position.coords.longitude));
      },
      () => {
        setHasDeviceLocation(false);
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 5_000 },
    );
  }, [lat, lng, onLatChange, onLngChange]);

  async function generateFromPhoto() {
    if (!photo) return;
    setGenerateError(null);
    setIsGenerating(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(photo);
      });

      const response = await fetch("/api/ai/pet-attrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl }),
      });

      const payload = (await response.json()) as
        | { species: Species; breed: string | null; color: string | null }
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "AI request failed");
      }

      setSpecies(payload.species);
      if (payload.breed) setBreed(payload.breed);
      if (payload.color) setColor(payload.color);
    } catch (error: unknown) {
      setGenerateError(error instanceof Error ? error.message : "AI request failed");
    } finally {
      setIsGenerating(false);
    }
  }

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  const canSubmit = useMemo(() => {
    const hasCoords = Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && lat !== "" && lng !== "";
    return (
      !isSubmitting &&
      Boolean(photo) &&
      color.trim().length > 0 &&
      description.trim().length > 0 &&
      (hasCoords || hasDeviceLocation)
    );
  }, [color, description, hasDeviceLocation, isSubmitting, lat, lng, parsedLat, parsedLng, photo]);

  async function resolveCoords() {
    const hasCoords = Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && lat !== "" && lng !== "";
    if (hasCoords) return { lat: parsedLat, lng: parsedLng };

    if (!navigator.geolocation) return null;

    return await new Promise<{ lat: number; lng: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => resolve(null),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 7_000 },
      );
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!photo) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const coords = await resolveCoords();
      if (!coords) {
        setSubmitError("Location unavailable. Enter Lat/Lng to submit.");
        setIsSubmitting(false);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const extension = photo.name.includes(".") ? photo.name.split(".").pop() : null;
      const fileName = `${
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      }${extension ? `.${extension}` : ""}`;
      const photoPath = `user/${fileName}`;

      const uploadResult = await supabase.storage
        .from(photoBucket)
        .upload(photoPath, photo, { contentType: photo.type });

      if (uploadResult.error) throw uploadResult.error;

      const photoUrl = getPublicStorageUrl(photoBucket, photoPath);
      const nowIso = new Date().toISOString();

      const insertResult = await supabase
        .from("pet_posts")
        .insert({
          post_type: postType,
          species,
          pet_name: petName.trim().length > 0 ? petName.trim() : null,
          breed: breed.trim().length > 0 ? breed.trim() : null,
          color: color.trim(),
          description: description.trim(),
          event_time: nowIso,
          lat: coords.lat,
          lng: coords.lng,
          contact_name:
            contactName.trim().length > 0 ? contactName.trim() : null,
          contact_phone:
            contactPhone.trim().length > 0 ? contactPhone.trim() : null,
          contact_email:
            contactEmail.trim().length > 0 ? contactEmail.trim() : null,
          photo_path: photoPath,
          source: "user",
          source_url: photoUrl,
          status: "active",
          created_at: nowIso,
        })
        .select("id")
        .single();

      if (insertResult.error) throw insertResult.error;

      onClose();
    } catch (error: unknown) {
      const errorPayload =
        error && typeof error === "object"
          ? {
              name: "name" in error ? String((error as { name?: unknown }).name) : undefined,
              message:
                "message" in error
                  ? String((error as { message?: unknown }).message)
                  : "Submit failed",
              code: "code" in error ? (error as { code?: unknown }).code : undefined,
              details:
                "details" in error
                  ? (error as { details?: unknown }).details
                  : undefined,
              hint: "hint" in error ? (error as { hint?: unknown }).hint : undefined,
              status:
                "status" in error
                  ? (error as { status?: unknown }).status
                  : undefined,
            }
          : { message: "Submit failed" };

      console.error("Report submit failed", errorPayload);
      setSubmitError(JSON.stringify(errorPayload, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PanelShell title="Report" onClose={onClose} hidden={hidden}>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5">
          <Image src={logo} alt="" fill sizes="40px" className="object-contain" />
        </div>
        <div className="text-sm text-white/80">Pet Scout</div>
      </div>

      <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={onSubmit}>
        <PhotoField
          value={photo}
          previewUrl={photoPreviewUrl}
          onChange={(file, previewUrl) => {
            setPhoto(file);
            setPhotoPreviewUrl(previewUrl);
          }}
          onGenerate={generateFromPhoto}
          isGenerating={isGenerating}
        />

        {generateError ? (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
            {generateError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Post type</div>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 text-sm text-white focus:outline-none"
              value={postType}
              onChange={(event) => setPostType(event.target.value as PostType)}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="shelter">Shelter</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Pet name</div>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={petName}
              onChange={(event) => setPetName(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Species</div>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 text-sm text-white focus:outline-none"
              value={species}
              onChange={(event) => setSpecies(event.target.value as Species)}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Breed</div>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Color</div>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm">
          <div className="text-white/80">Description</div>
          <textarea
            className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Lat</div>
            <input
              inputMode="decimal"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={lat}
              onChange={(event) => onLatChange(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Lng</div>
            <input
              inputMode="decimal"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={lng}
              onChange={(event) => onLngChange(event.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10"
          onClick={onStartPickLocation}
        >
          Pick location on map
        </button>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Contact name</div>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Contact phone</div>
            <input
              inputMode="tel"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <div className="text-white/80">Contact email</div>
            <input
              type="email"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
            />
          </label>
        </div>

        {submitError ? (
          <pre className="whitespace-pre-wrap rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-100">
            {submitError}
          </pre>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className={
            canSubmit
              ? "mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-black"
              : "mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/30 text-sm font-semibold text-white/60"
          }
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </PanelShell>
  );
}
