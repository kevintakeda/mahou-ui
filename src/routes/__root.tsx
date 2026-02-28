import { TanStackDevtools } from '@tanstack/react-devtools'
import { Code2Icon, EyeOffIcon, House } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useAtom, useSetAtom } from 'jotai'
import appCss from '../styles.css?url'
import type { ReactNode } from 'react'
import { isDocsVisibleAtom, isMenuOpenAtom } from '@/components/atoms'
import { MenuDrawer, MenuTriggerButton } from '@/components/menu/menu'
import { NotFound } from '@/components/not-found'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Mahou UI',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/icon.svg',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppShell>
          <Outlet />

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </AppShell>
      </body>
    </html>
  )
}

function AppShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setMenuOpen] = useAtom(isMenuOpenAtom)

  return (
    <>
      <MenuDrawer isOpen={isMenuOpen} onOpenChange={setMenuOpen} />
      <TopLeftControls />
      {children}
    </>
  )
}

function TopLeftControls() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isSpellRoute = pathname.startsWith('/ui/')
  const [isDocsVisible, setDocsVisible] = useAtom(isDocsVisibleAtom)
  const setMenuOpen = useSetAtom(isMenuOpenAtom)

  const toggleMenu = () => {
    setDocsVisible(false)
    setMenuOpen((prev) => !prev)
  }

  const toggleDocsVisible = () => {
    setMenuOpen(false)
    setDocsVisible((prev) => !prev)
  }

  return (
    <div className="absolute top-6 left-6 z-50">
      <motion.div layout className="flex items-center gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {isSpellRoute && (
            <motion.div
              key="home-button"
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                duration: 0.4,
                bounce: 0.3,
              }}
              className="shrink-0"
            >
              <Link to="/">
                <Button
                  size="icon-lg"
                  variant="secondary"
                  className="shadow-md rounded-xl"
                  aria-label="Go to home"
                >
                  <House className="size-5" />
                </Button>
              </Link>
            </motion.div>
          )}

          <motion.div
            key="menu-button"
            layout
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              duration: 0.4,
              bounce: 0.3,
              delay: 0.1,
            }}
          >
            <MenuTriggerButton onClick={toggleMenu} />
          </motion.div>

          {isSpellRoute && (
            <motion.div
              key="docs-button"
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                duration: 0.4,
                bounce: 0.3,
              }}
            >
              <Button
                size="icon-lg"
                variant="secondary"
                className="shadow-md rounded-xl"
                aria-label={isDocsVisible ? 'Hide docs' : 'Show docs'}
                aria-pressed={isDocsVisible}
                onClick={toggleDocsVisible}
              >
                {isDocsVisible ? (
                  <EyeOffIcon className="size-5" />
                ) : (
                  <Code2Icon className="size-5" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
