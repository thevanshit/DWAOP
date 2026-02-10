import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ end, duration = 2000, className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * end);
      
      setCount(currentCount);
      
      if (progress >= 1) {
        setIsAnimating(false);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isAnimating]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className="text-2xl font-bold text-gray-900">
        {count.toString().padStart(end.toString().length, '0')}
      </span>
      <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"></div>
    </div>
  );
}