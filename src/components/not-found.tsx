import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-light mb-2">404</h1>
      <p className="text-neutral-400 mb-8">Page not found</p>
      <Link to="/">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </div>
  )
}
