import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <div className="flex items-center gap-2.5 font-semibold text-lime-900 dark:text-lime-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <title>Mahou UI</title>
              <circle
                cx="20"
                cy="4"
                r="3"
                className="fill-lime-900 dark:fill-lime-100"
              ></circle>
              <rect
                x="12"
                y="8"
                width="4"
                height="4"
                className="fill-lime-900 dark:fill-[#E989FE]"
              />
            </svg>
            Mahou UI
          </div>
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
