import { Code2Icon, EyeOffIcon, RefreshCw } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from './ui/button'
import { isDocsVisibleAtom } from './atoms'

function ReloadButton({ onReload }: { onReload: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleClick = () => {
    setIsSpinning(true)
    onReload()
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleClick}>
      <motion.div
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        onAnimationComplete={() => setIsSpinning(false)}
      >
        <RefreshCw />
      </motion.div>
    </Button>
  )
}

function DocsButton() {
  const [isDocsVisible, setDocsVisible] = useAtom(isDocsVisibleAtom)

  return (
    <Button
      size="icon"
      onClick={() => setDocsVisible((el) => !el)}
      variant={'ghost'}
      className="hidden md:inline-flex"
    >
      <motion.div
        key={isDocsVisible ? 'open' : 'closed'}
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
        exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
        transition={{ duration: 0.2 }}
      >
        {isDocsVisible ? <EyeOffIcon /> : <Code2Icon />}
      </motion.div>
    </Button>
  )
}

export function Toolbar({ onReload }: { onReload: () => void }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isHomePage = pathname === '/'
  const [isDocsVisible, setDocsVisible] = useAtom(isDocsVisibleAtom)

  return (
    <div className="absolute top-2 right-2 z-30">
      <AnimatePresence>
        {!isHomePage && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', bounce: 0.5, duration: 0.6 },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.18, ease: 'easeOut' },
            }}
            className="pointer-events-auto rounded-full bg-neutral-950 gloss bg-[radial-gradient(circle_at_top_center,oklch(30.9%_0_0)_0%,oklch(27.9%_0_0)_70%)] shadow-[inset_0_0_1px_3px_rgba(255,255,255,0.04),0_8px_1rem_rgba(0,0,0,0.08)]"
          >
            <DocsButton />
            <ReloadButton onReload={onReload} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
