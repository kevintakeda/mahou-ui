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
          <div className="flex items-center gap-2.5 font-semibold text-accent">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Logo"
            >
              <title>Mahou Bits</title>
              <circle cx={20} cy={4} r={3} fill="currentColor" />
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
