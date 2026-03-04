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
import { MenuTriggerButton } from '../components/menu/menu'
import type { ReactNode } from 'react'
import { isDocsVisibleAtom, isMenuOpenAtom } from '@/components/atoms'
import { MenuDrawer } from '@/components/menu/menu'
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
      <MenuTriggerButton />
      {children}
    </>
  )
}
