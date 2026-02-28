import type React from 'react'

const OrganicBackground = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <defs>
        <filter
          id="blur"
          x="-50%"
          y="-50%"
          width="300%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="90" />
        </filter>
      </defs>
      <g filter={'url(#blur)'} fill="oklch(0.6 0.1 124 / 0.1)">
        {/* Left Blob */}
        <circle cx="256" cy="360" r="120" opacity={0.5} />

        {/* Right Blob */}
        <circle cx="764" cy="360" r="120" opacity={0.5} />
      </g>
    </svg>
  )
}

export default OrganicBackground
