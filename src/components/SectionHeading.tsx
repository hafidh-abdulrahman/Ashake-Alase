export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className={`font-display text-sm font-medium italic ${light ? "text-gold-light" : "text-ember"}`}>{eyebrow}</p>
      )}
      <h2
        className={`text-balance mt-2 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl ${
          light ? "text-cream" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-xl text-base leading-relaxed ${light ? "text-cream/70" : "text-charcoal/70"} ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
