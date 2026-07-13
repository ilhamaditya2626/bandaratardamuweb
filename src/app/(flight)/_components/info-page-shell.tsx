import Link from "next/link";
import type { ReactNode } from "react";

export const serifStyle = { fontFamily: "'Playfair Display', serif" } as const;

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type PageHeroProps = {
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
  title: ReactNode;
  description: string;
  gradient?: string;
};

export function PageHero({
  backgroundImage,
  breadcrumbs,
  title,
  description,
  gradient = "linear-gradient(to right, rgba(17, 25, 40, 0.92) 30%, rgba(17, 25, 40, 0.45))",
}: PageHeroProps) {
  return (
    <header
      className="flex min-h-[60vh] items-center px-6 pb-16 pt-28"
      style={{
        backgroundImage: `${gradient}, url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-gray-400 transition hover:text-[#facc15]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-semibold text-[#facc15]" : "text-gray-400"}>
                    {item.label}
                  </span>
                )}
                {!isLast && <i className="fa-solid fa-chevron-right text-[10px] text-gray-600"></i>}
              </div>
            );
          })}
        </div>

        <h1
          className="mb-6 text-5xl leading-tight text-white md:text-7xl"
          style={serifStyle}
        >
          {title}
        </h1>
        <p className="border-l-2 border-[#facc15] pl-6 text-lg leading-relaxed text-gray-300">
          {description}
        </p>
      </div>
    </header>
  );
}
