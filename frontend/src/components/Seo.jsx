import { useEffect } from "react";

const SITE_URL = "https://cozy-garden-three.vercel.app";

export default function Seo({ title, description, path = "/", noindex = false }) {
  useEffect(() => {
    const fullTitle = title === "Cozy Garden" ? "Cozy Garden | Cozy Pixel-Art Farming Game" : `${title} | Cozy Garden`;
    document.title = fullTitle;
    const values = {
      description,
      canonical: `${SITE_URL}${path}`,
      "og:title": fullTitle,
      "og:description": description,
      "og:type": "website",
      "og:url": `${SITE_URL}${path}`,
      "og:image": `${SITE_URL}/social-preview.png`,
      "twitter:card": "summary_large_image",
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": `${SITE_URL}/social-preview.png`,
      robots: noindex ? "noindex, nofollow" : "index, follow",
    };
    for (const [key, content] of Object.entries(values)) {
      const selector = key === "canonical" ? 'link[rel="canonical"]' : `meta[${key.startsWith("og:") ? "property" : "name"}="${key}"]`;
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement(key === "canonical" ? "link" : "meta");
        if (key === "canonical") element.rel = "canonical";
        else if (key.startsWith("og:")) element.setAttribute("property", key);
        else element.name = key;
        document.head.appendChild(element);
      }
      if (key === "canonical") element.href = content;
      else element.content = content;
    }
  }, [description, noindex, path, title]);
  return null;
}
