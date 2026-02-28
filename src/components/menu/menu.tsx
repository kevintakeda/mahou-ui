import { AnimatePresence, motion } from 'motion/react'
import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

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
            className="fixed top-4 left-4 bottom-4 rounded-2xl bg-black w-80 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-5 flex-1 overflow-y-auto scrollbar-hidden">
              <MenuContent onSelect={() => onOpenChange(false)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface MenuTriggerButtonProps {
  onClick: () => void
}

export function MenuTriggerButton({ onClick }: MenuTriggerButtonProps) {
  return (
    <Button
      variant="secondary"
      size="icon-lg"
      className="shadow-md rounded-xl"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
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

export function MenuContent({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="flex flex-col gap-1 mt-20">
      <div className="px-3 mb-4">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Components
        </h2>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        {spells.map((spell) => (
          <motion.div key={spell.id} variants={item}>
            <Link
              to="/ui/$id"
              params={{ id: spell.id }}
              onClick={onSelect}
              className="flex items-center h-10 px-3 w-full text-sm font-medium text-neutral-400 transition-colors hover:text-white data-[status=active]:text-white"
            >
              {spell.title}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
