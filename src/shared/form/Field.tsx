import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useFormContext } from './FormContext'
import { Button } from '@/shared/components/Button'

interface FieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  as?: 'textarea'
  rows?: number
  // Slot pour les contrôles custom (CountrySelect, boutons de couleur…)
  // Field gère uniquement le label + l'erreur, l'enfant gère le contrôle
  children?: React.ReactNode
}

export function Field({ name, label, type = 'text', placeholder, as: asEl, rows, children }: FieldProps) {
  const { values, errors, touched, submitted, change, blur } = useFormContext()
  const [visible, setVisible] = useState(false)

  const error = errors[name]
  const showError = !!error && (!!touched[name] || submitted)
  const isPassword = type === 'password'

  const sharedInputProps = {
    id: name,
    className: 'form-input',
    'aria-invalid': showError || undefined,
    'aria-describedby': showError ? `${name}-error` : undefined,
    placeholder,
    onBlur: () => blur(name),
  }

  return (
    <div>
      <label htmlFor={name} className="form-label">
        {label}
      </label>

      {children ?? (
        asEl === 'textarea' ? (
          <textarea
            {...sharedInputProps}
            value={(values[name] as string) ?? ''}
            onChange={e => change(name, e.target.value)}
            rows={rows}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        ) : isPassword ? (
          <div className="form-input-wrapper">
            <input
              {...sharedInputProps}
              type={visible ? 'text' : 'password'}
              value={(values[name] as string) ?? ''}
              onChange={e => change(name, e.target.value)}
            />
            <Button variant="auth-input-icon" type="button" onClick={() => setVisible(v => !v)}>
              {visible ? <EyeOff size={15} /> : <Eye size={15} />}
            </Button>
          </div>
        ) : (
          <input
            {...sharedInputProps}
            type={type}
            value={(values[name] as string) ?? ''}
            onChange={e => change(name, e.target.value)}
          />
        )
      )}

      {showError && (
        <p id={`${name}-error`} role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  )
}
