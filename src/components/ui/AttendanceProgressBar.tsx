'use client'

interface AttendanceProgressBarProps {
    percentage: number
    total: number
    present: number
    showDetails?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function AttendanceProgressBar({
    percentage,
    total,
    present,
    showDetails = true,
    size = 'md',
    className = ''
}: AttendanceProgressBarProps) {
    const getColor = () => {
        if (percentage >= 75) return 'bg-green-500'
        if (percentage >= 65) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getTextColor = () => {
        if (percentage >= 75) return 'text-green-600'
        if (percentage >= 65) return 'text-yellow-600'
        return 'text-red-600'
    }

    const heights = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-2.5'
    }

    return (
        <div className={className}>
            <div className={`bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {showDetails && (
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-500">
                        {present}/{total} classes
                    </span>
                    <span className={`text-xs font-medium ${getTextColor()}`}>
                        {percentage}%
                    </span>
                </div>
            )}
        </div>
    )
}
