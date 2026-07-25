import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
}

const variantStyles = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
}

function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const skeletonStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  const skeletonClass = cn('skeleton', variantStyles[variant], className)

  if (count === 1) {
    return (
      <div
        className={skeletonClass}
        style={skeletonStyle}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={skeletonClass}
          style={skeletonStyle}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Skeleton }
export default Skeleton
