import { useEffect } from "react";
import { site } from "@/config/site";

const productionUrl = "https://ashakealase1.com";
const defaultImage = `${productionUrl}${site.logo}`;

type SeoProps = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
  image?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const upsertMeta = (
  selector: string,
  attributes: Record<string, string>,
  content: string,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([name, value]) =>
      element!.setAttribute(name, value),
    );
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

export function Seo({
  title,
  description,
  path,
  indexable = true,
  image = defaultImage,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const canonical = `${productionUrl}${path === "/" ? "/" : path}`;
    document.title = title;
    upsertMeta(
      'meta[name="description"]',
      { name: "description" },
      description,
    );
    upsertMeta(
      'meta[name="robots"]',
      { name: "robots" },
      indexable ? "index, follow" : "noindex, nofollow",
    );
    upsertLink("canonical", canonical);

    const openGraph = [
      ["og:title", title],
      ["og:description", description],
      ["og:type", "website"],
      ["og:url", canonical],
      ["og:image", image],
      ["og:site_name", site.name],
    ];
    openGraph.forEach(([property, content]) =>
      upsertMeta(`meta[property="${property}"]`, { property }, content),
    );
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: "twitter:card" },
      "summary_large_image",
    );
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      description,
    );
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);

    const existingSchema = document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-schema="true"]',
    );
    existingSchema?.remove();
    if (structuredData) {
      const schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.dataset.seoSchema = "true";
      schema.textContent = JSON.stringify(structuredData);
      document.head.appendChild(schema);
    }
  }, [description, image, indexable, path, structuredData, title]);

  return null;
}

export { productionUrl };
