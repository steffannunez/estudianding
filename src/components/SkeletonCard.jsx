export default function SkeletonCard({ lines = 3, showIcon = false, className = '' }) {
  return (
    <div className={`glass p-5 ${className}`}>
      <div className="animate-pulse">
        {showIcon && (
          <div className="w-10 h-10 rounded-full bg-white/10 mb-4" />
        )}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-white/10 rounded-lg"
              style={{ width: `${[100, 80, 60][i % 3]}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
