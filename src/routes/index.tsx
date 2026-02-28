import { createFileRoute } from '@tanstack/react-router'
import { BotMessageSquare, Paintbrush, Wand, Wind } from 'lucide-react'
import { useSetAtom } from 'jotai'
import BG from '@/components/bg'
import { isMenuOpenAtom } from '@/components/atoms'
import { Button } from '@/components/ui/button'
import { Frame } from '@/components/frame'

export const Route = createFileRoute('/')({
  component: App,
})
function App() {
  const setMenuOpen = useSetAtom(isMenuOpenAtom)

  return (
    <Frame>
      <div className="h-full p-20 bg-[radial-gradient(125%_205%_at_50%_10%,oklch(20.5%_0_124)_40%,oklch(26%_0.0194_124)_100%)] rounded-2xl relative overflow-clip">
        <div className="grid place-items-center h-full absolute inset-0">
          <BG className="w-full h-auto" />
        </div>
        <div className="grid place-items-center h-full absolute inset-0">
          <Line1 className="mr-[120px] -mt-[320px]" />
          <Line1 className="ml-[120px] -mt-[320px] scale-x-[-1]" />
          <Line2 className="mr-[140px] mt-0"></Line2>
          <Line2 className="ml-[140px] mt-0 scale-x-[-1]"></Line2>
        </div>
        <div className="grid place-items-center h-full -mt-10 relative">
          <div className="text-center">
            <img
              className="block m-auto"
              src="/mahou.webp"
              width={300}
              height={207}
              alt="Mahou"
            />
            <h1 className="mt-2 font-normal text-neutral-500">Mahou UI</h1>
            <Features />
            <div className="mt-6">
              <div className="bg-neutral-950 shadow-[0_1px_1px_rgba(255,255,255,0.1)] inline-flex rounded-full p-1">
                <Button size={'lg'} onClick={() => setMenuOpen(true)}>
                  Browse components
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Star
        className={'absolute left-[calc(-12px+50%)] top-[calc(1rem-12px)]'}
      />
    </Frame>
  )
}

const Features = () => {
  const data = [
    {
      title: 'AI-Native',
      icon: BotMessageSquare,
    },
    {
      title: 'Smooth',
      icon: Wind,
    },
    {
      title: 'Magical',
      icon: Wand,
    },
    {
      title: 'Customizable',
      icon: Paintbrush,
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0">
        {data.map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={index}
              className="relative flex flex-col items-center px-0 md:px-4 first:pl-0 last:pr-0"
            >
              {/* Icon & Content Stack */}
              <div className="mb-4 shrink-0 text-white">
                <Icon size={24} strokeWidth={1} />
              </div>

              <div>
                <h3 className="text-sm text-foreground">{item.title}</h3>
              </div>

              {/* Vertical Divider (Hidden on mobile, hidden after last item) */}
              {index !== data.length - 1 && (
                <div className="hidden md:block absolute right-0 top-3 bottom-3 w-px bg-white/10" />
              )}

              {/* Horizontal Divider (Mobile only) */}
              {index !== data.length - 1 && (
                <div className="block md:hidden w-full h-px bg-white/10 mt-4" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Line1({ className }: { className: string }) {
  return (
    <svg
      className={'absolute ' + className}
      xmlns="http://www.w3.org/2000/svg"
      width="768"
      height="576"
    >
      <defs>
        <linearGradient id="strokeGradient" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          <stop offset="80%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      <path
        fill="none"
        stroke="url(#strokeGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 192h78.874a32 32 123.69 0 1 26.626 14.25l77 115.5A32 32 236.31 0 0 209.126 336H288"
      />
    </svg>
  )
}

function Line2({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="768"
      height="576"
      className={'absolute ' + className}
    >
      <defs>
        <linearGradient id="strokeGradient2" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#strokeGradient2)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 288h82.745a32 32 225 0 0 22.628-9.373l29.254-29.254A32 32 135 0 1 157.255 240H288"
      />
    </svg>
  )
}

function Star({ className }: { className: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M128.5 24C145.117 72.6621 183.338 110.883 232 127.5C183.338 144.117 145.117 182.338 128.5 231C111.883 182.338 73.6621 144.117 25 127.5C73.6621 110.883 111.883 72.6621 128.5 24Z"
        fill="oklch(20.5% 0 0)"
        stroke="oklch(26.9% 0 0)"
        strokeWidth={10.666}
      />
    </svg>
  )
}
