import { z } from 'zod'

export type FieldErrors<T extends string> = Partial<Record<T, string>>

const requiredString = (message: string) => z.string().trim().min(1, message)

export const loginSchema = z.object({
  email: requiredString("L'email est requis.").email("L'email doit être valide."),
  password: requiredString("Le mot de passe est requis."),
})

export const registerSchema = z.object({
  username: requiredString("Le nom d'utilisateur est requis.")
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
    .max(24, "Le nom d'utilisateur ne peut pas dépasser 24 caractères.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Utilisez seulement lettres, chiffres, tirets et underscores."),
  email: requiredString("L'email est requis.").email("L'email doit être valide."),
  password: requiredString("Le mot de passe est requis.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  confirm: requiredString("La confirmation est requise."),
}).refine((data) => data.password === data.confirm, {
  path: ['confirm'],
  message: "Les mots de passe ne correspondent pas.",
})

export const forgotPasswordSchema = z.object({
  email: requiredString("L'email est requis.").email("L'email doit être valide."),
})

export const resetPasswordSchema = z.object({
  token: requiredString("Le lien de réinitialisation est invalide."),
  password: requiredString("Le nouveau mot de passe est requis.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  confirm: requiredString("La confirmation est requise."),
}).refine((data) => data.password === data.confirm, {
  path: ['confirm'],
  message: "Les mots de passe ne correspondent pas.",
})

export const changePasswordSchema = z.object({
  currentPassword: requiredString("Le mot de passe actuel est requis."),
  newPassword: requiredString("Le nouveau mot de passe est requis.")
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),
  confirmPassword: requiredString("La confirmation est requise."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Les mots de passe ne correspondent pas.",
}).refine((data) => data.currentPassword !== data.newPassword, {
  path: ['newPassword'],
  message: "Le nouveau mot de passe doit être différent de l'ancien.",
})

export const profileSchema = z.object({
  firstName: z.string().trim().max(50, "Le prénom ne peut pas dépasser 50 caractères."),
  lastName: z.string().trim().max(50, "Le nom ne peut pas dépasser 50 caractères."),
  username: requiredString("Le nom d'utilisateur est requis.")
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
    .max(24, "Le nom d'utilisateur ne peut pas dépasser 24 caractères.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Utilisez seulement lettres, chiffres, tirets et underscores."),
  email: requiredString("L'email est requis.").email("L'email doit être valide."),
  bio: z.string().trim().max(280, "La biographie ne peut pas dépasser 280 caractères."),
  countryCode: requiredString("Le pays est requis."),
  color: z.enum(['Blancs', 'Noirs', 'Les deux'], {
    message: "Choisissez une couleur préférée.",
  }),
  elo: z.number(),
  joinedYear: z.number(),
})

export function getFieldErrors<T extends string>(error: z.ZodError): FieldErrors<T> {
  return error.issues.reduce<FieldErrors<T>>((errors, issue) => {
    const field = issue.path[0]
    if (typeof field === 'string' && !errors[field as T]) {
      errors[field as T] = issue.message
    }
    return errors
  }, {})
}
