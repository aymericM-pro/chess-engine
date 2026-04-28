import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

export function SettingsPage() {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative z-10 w-full max-w-[1080px] mx-auto pt-8 px-4">
      <h1 className="font-display text-xl font-semibold tracking-[0.1em] text-text-primary mb-6">
        {t('settings.title')}
      </h1>
      <div className="bg-bg-2 border border-border rounded-xl p-6 max-w-sm">
        <label className="font-display text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-text-muted block mb-3">
          {t('settings.languageLabel')}
        </label>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`font-display text-[0.75rem] font-semibold tracking-[0.08em] uppercase py-2 px-4 rounded-lg border transition-all duration-150 cursor-pointer ${
                i18n.language === lang.code
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-bg-3 border-border text-text-muted hover:text-text-primary hover:border-white/14'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
