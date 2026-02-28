import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  copyLabel?: string
  copiedLabel?: string
  className?: string
}

export function CopyButton({
  text,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied code',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        'inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-neutral-400 outline-none transition-[color,transform] duration-150 hover:bg-transparent hover:text-neutral-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-neutral-500',
        copied && 'text-green-300 hover:text-green-300',
        className,
      )}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
    </button>
  )
}
