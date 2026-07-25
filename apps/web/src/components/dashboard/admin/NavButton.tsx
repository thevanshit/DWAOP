'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function NavButton({ icon: Icon, label, isActive, onClick }: { icon: any; label: string; isActive?: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 justify-start",
        isActive ? "text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {isActive && (
        <motion.div layoutId="navIndicator" className="absolute inset-0 bg-blue-50 rounded-xl -z-10 shadow-sm shadow-blue-500/20" />
      )}
      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-blue-600")} />
      <span>{label}</span>
    </motion.button>
  )
}
