'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={cn(
        'bg-white rounded-xl border border-[var(--color-border)]',
        paddingStyles[padding],
        hover &&
          'hover:shadow-md hover:border-[var(--color-border-light)] transition-all duration-200',
        onClick && 'w-full text-left cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

interface CardSubComponentProps {
  children: React.ReactNode
  className?: string
}

function CardHeader({ children, className }: CardSubComponentProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-4',
        className
      )}
    >
      {children}
    </div>
  )
}

function CardBody({ children, className }: CardSubComponentProps) {
  return <div className={cn('', className)}>{children}</div>
}

function CardFooter({ children, className }: CardSubComponentProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-4 border-t border-[var(--color-border)] mt-4',
        className
      )}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export { Card, CardHeader, CardBody, CardFooter }
export default Card
