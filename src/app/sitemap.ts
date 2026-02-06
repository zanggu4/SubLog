import type { MetadataRoute } from "next";

const BASE_URL = "https://sublog.bbiero.dev";
const SUPPORTED_LANGS = ["en", "ko", "ja", "zh"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/login", priority: 0.5 },
  ];

  return pages.flatMap(({ path, priority }) =>
    SUPPORTED_LANGS.map((lang) => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
