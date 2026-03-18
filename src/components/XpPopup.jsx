import { useEffect } from 'react'

export default function XpPopup({ amount, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 700)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <span className="xp-popup" style={{ top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
      +{amount} XP
    </span>
  )
}
