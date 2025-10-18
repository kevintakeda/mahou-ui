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
              viewBox="0 0 48 48"
              fill="none"
            >
              <title>Mahou UI</title>
              <rect width="48" height="48" rx="8" fill="#09000A" />
              <path
                d="M24 7L24.9741 11.1282C26.3662 17.0276 30.9724 21.6338 36.8718 23.0259L41 24L36.8718 24.9741C30.9724 26.3662 26.3662 30.9724 24.9741 36.8718L24 41L23.0259 36.8718C21.6338 30.9724 17.0276 26.3662 11.1282 24.9741L7 24L11.1282 23.0259C17.0276 21.6338 21.6338 17.0276 23.0259 11.1282L24 7Z"
                fill="#D3FB5B"
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
