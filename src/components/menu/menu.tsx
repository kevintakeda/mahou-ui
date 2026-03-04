import { AnimatePresence, motion } from 'motion/react'
import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAtom } from 'jotai/react'
import { isMenuOpenAtom } from '../atoms'
import { Button } from '../ui/button'

interface MenuDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const metadataModules = import.meta.glob<{
  default?: { title?: string }
  metadata?: { title?: string }
}>('/src/spells/*/metadata.ts', { eager: true })

const spells = Object.entries(metadataModules)
  .map(([path, module]) => {
    const id = path.split('/')[3]
    const metadata = module.default || module.metadata
    return {
      id,
      title:
        metadata?.title ||
        id
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export function MenuDrawer({ isOpen, onOpenChange }: MenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{
              clipPath: 'inset(0% 100% 100% 0% round 16px)',
              x: '-32px',
            }}
            animate={{
              clipPath: 'inset(0% 0% 0% 0% round 16px)',
              x: 0,
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 14,
                mass: 0.8,
              },
            }}
            exit={{
              clipPath: 'inset(0% 100% 100% 0% round 16px)',
              transition: {
                type: 'tween',
                ease: 'easeIn',
                duration: 0.2,
              },
            }}
            className="fixed inset-y-2 left-2 right-2 w-auto rounded-xl bg-neutral-900 shadow-2xl z-50 flex flex-col sm:top-4 sm:left-4 sm:bottom-4 sm:right-auto sm:w-80 sm:rounded-2xl"
          >
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto scrollbar-hidden">
              <MenuContent onSelect={() => onOpenChange(false)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function MenuTriggerButton() {
  const [isOpen, setOpen] = useAtom(isMenuOpenAtom)

  return (
    <div className="absolute top-3 left-3 z-50 sm:top-6 sm:left-6">
      <Button
        variant="secondary"
        size="icon"
        className="shadow-md rounded-lg overflow-clip"
        onClick={() => setOpen((prev) => !prev)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={isOpen ? 'open' : 'closed'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <PanelLeftClose /> : <PanelLeft />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
} as const

const item = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 450,
      damping: 35,
    },
  },
} as const

const linkClass =
  'flex items-center py-1 px-3 w-full text-sm font-medium text-neutral-400 transition-colors hover:text-lime-200 data-[status=active]:text-lime-200'

export function MenuContent({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="flex flex-col gap-1 mt-8 sm:mt-12">
      <div className="mb-2 mt-4">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Links
        </h2>
      </div>
      <div>
        <Link to="/" onClick={onSelect} className={linkClass}>
          Home
        </Link>
      </div>
      <div className="mb-2 mt-4">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Components
        </h2>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col"
      >
        {spells.map((spell) => (
          <motion.div key={spell.id} variants={item}>
            <Link
              to="/ui/$id"
              params={{ id: spell.id }}
              onClick={onSelect}
              className={linkClass}
            >
              {spell.title}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
