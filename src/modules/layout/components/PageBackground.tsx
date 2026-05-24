import { useThemeStore } from "@/shared/theme/useThemeStore"

export function PageBackground() {
  const { theme } = useThemeStore()

  const background = theme === "dark"
    ? `
        radial-gradient(ellipse 70% 50% at 10% 5%, rgba(60,80,120,0.07) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 90% 95%, rgba(60,80,120,0.05) 0%, transparent 55%),
        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,0.02) 0%, transparent 70%)
      `
    : `
        radial-gradient(ellipse 70% 50% at 10% 5%, rgba(160,104,32,0.05) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 90% 95%, rgba(160,104,32,0.03) 0%, transparent 55%),
        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(160,104,32,0.02) 0%, transparent 70%)
      `

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background }}
    />
  )
}
