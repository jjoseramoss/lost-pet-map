import os, re, json
import time
import requests

out_dir = os.path.join(os.path.dirname(__file__), "..", "src", "app", "images")
os.makedirs(out_dir, exist_ok=True)

items = [
  ("labrador retriever black dog", "dog", "Labrador Retriever", "black"),
  ("golden retriever dog", "dog", "Golden Retriever", "golden"),
  ("german shepherd dog", "dog", "German Shepherd", "black/tan"),
  ("beagle dog", "dog", "Beagle", "tricolor"),
  ("siberian husky dog", "dog", "Siberian Husky", "gray/white"),
  ("poodle dog", "dog", "Poodle", "white"),
  ("chihuahua dog", "dog", "Chihuahua", "tan"),
  ("boxer dog", "dog", "Boxer", "fawn"),
  ("dachshund dog", "dog", "Dachshund", "brown"),
  ("border collie dog", "dog", "Border Collie", "black/white"),
  ("siamese cat", "cat", "Siamese", "cream/brown"),
  ("maine coon cat", "cat", "Maine Coon", "brown tabby"),
  ("persian cat", "cat", "Persian", "white"),
  ("bengal cat", "cat", "Bengal", "spotted brown"),
  ("black cat", "cat", "Domestic Shorthair", "black"),
]

session = requests.Session()
session.headers.update(
    {
        "User-Agent": "lost-pet-map-dev/1.0 (local script; contact: none)",
        "Accept": "application/json,text/html;q=0.9,*/*;q=0.8",
    }
)

API_URL = "https://commons.wikimedia.org/w/api.php"


def get_image_urls(query: str) -> list[str]:
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrlimit": 5,
        "gsrnamespace": 6,
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": 1024,
        "origin": "*",
    }
    r = session.get(API_URL, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    pages = (data.get("query") or {}).get("pages") or {}
    urls: list[str] = []
    for page in pages.values():
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        url = info.get("url")
        if isinstance(url, str):
            urls.append(url)
    return urls


def main() -> None:
    results: list[dict] = []

    for idx, (query, species, breed, color) in enumerate(items, start=1):
        candidate_urls = get_image_urls(query)
        if not candidate_urls:
            raise SystemExit(f"No image url found for query: {query}")

        img_url = candidate_urls[0]
        ext = os.path.splitext(img_url.split("?")[0])[1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            ext = ".jpg"

        safe_breed = re.sub(r"[^a-z0-9]+", "_", breed.lower()).strip("_")
        filename = f"{species}_{safe_breed}_{idx:02d}{ext}"
        out_path = os.path.join(out_dir, filename)

        if os.path.exists(out_path):
            print(f"Skipping existing {filename}")
        else:
            print(f"Downloading {query} -> {filename}")
            downloaded = False
            for candidate in candidate_urls[:5]:
                for attempt in range(5):
                    img = session.get(candidate, timeout=60)
                    if img.status_code == 429:
                        time.sleep(2.0 + attempt * 2.0)
                        continue
                    if img.status_code >= 400:
                        break
                    with open(out_path, "wb") as f:
                        f.write(img.content)
                    img_url = candidate
                    downloaded = True
                    break
                if downloaded:
                    break
            if not downloaded:
                raise SystemExit(f"Failed downloading after retries: {candidate_urls[0]}")

        time.sleep(1.5)

        results.append(
            {
                "filename": filename,
                "species": species,
                "breed": breed,
                "color": color,
                "source_url": img_url,
                "source": "Wikimedia Commons",
            }
        )

    meta_path = os.path.join(out_dir, "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Wrote {len(results)} images and metadata.json")


if __name__ == "__main__":
    main()
