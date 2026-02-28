import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Code2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CardProps {
  id: string
  children: React.ReactNode
  className?: string
  title?: string
}

export function Card({ children, className, id, title }: CardProps) {
  return (
    <div
      className={clsx(
        'group relative bg-neutral-950 rounded-md overflow-hidden flex flex-col h-full',
        className,
      )}
    >
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <span className="text-[10px] text-neutral-500/50 group-hover:text-neutral-200 transition-colors duration-300 uppercase tracking-widest font-bold px-2 py-1 flex items-center gap-2">
          {title || id}
        </span>
      </div>

      <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
        <Link to="/ui/$id" params={{ id }}>
          <Button variant="secondary" title="See Code">
            <Code2Icon />
            Get code
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        {children}
      </div>
    </div>
  )
}
