export function PageBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 10% 5%, rgba(88,166,255,0.06) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 90% 95%, rgba(63,185,80,0.05) 0%, transparent 55%),
          radial-gradient(ellipse 80% 60% at 50% 50%, rgba(118,150,86,0.03) 0%, transparent 70%)
        `,
      }}
    />
  )
}
