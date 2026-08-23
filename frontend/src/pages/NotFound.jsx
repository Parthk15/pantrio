import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-700">
        <Leaf size={26} strokeWidth={1.7} />
      </div>
      <h1 className="font-display text-3xl text-ink">This shelf is empty</h1>
      <p className="mt-3 text-ink-faint">The page you're looking for doesn't exist.</p>
      <div className="mt-8">
        <Button as={Link} to="/" variant="primary">
          Back to home
        </Button>
      </div>
    </div>
  )
}
