import { cn } from "@/lib/cn";

const spans = { tall: "row-span-2", wide: "col-span-2", square: "" } as const;
const galleryVideos = [
  {
    src: "/videos/display-1.mp4",
    alt: "Ashake Alase food display 1",
    size: "tall",
  },
  {
    src: "/videos/display-3.mp4",
    alt: "Ashake Alase food display 3",
    size: "tall",
  },
  {
    src: "/videos/display-4.mp4",
    alt: "Ashake Alase food display 4",
    size: "square",
  },
  {
    src: "/videos/display-5.mp4",
    alt: "Ashake Alase food display 5",
    size: "wide",
  },
  {
    src: "/videos/display-6.mp4",
    alt: "Ashake Alase food display 6",
    size: "square",
  },
] as const;

export function Gallery() {
  return (
    <section className="bg-ink py-16 text-surface lg:py-28">
      <div className="container-page">
        <p className="eyebrow text-accent">A little visual appetite</p>
        <h2 className="mt-3 max-w-xl text-4xl text-surface md:text-6xl">
          The table is calling.
        </h2>
        <div className="mt-10 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:mt-14 lg:auto-rows-[14rem]">
          {galleryVideos.map((video) => (
            <div
              key={video.src}
              className={cn(
                "group overflow-hidden rounded-2xl",
                spans[video.size],
              )}
            >
              <video
                src={video.src}
                aria-label={video.alt}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
