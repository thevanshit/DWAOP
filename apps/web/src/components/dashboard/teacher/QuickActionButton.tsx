'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function QuickActionButton({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
    >
      <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{label}</span>
      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-blue-600 transition-colors" />
    </motion.button>
  )
}
