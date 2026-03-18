export default function LoadingSpinner({ message, fullPage = true }) {
  const spinner = (
    <div className="glass p-8 flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      {message && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {message}
        </p>
      )}
    </div>
  )

  if (!fullPage) return spinner

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {spinner}
    </div>
  )
}
