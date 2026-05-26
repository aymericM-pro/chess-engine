import { useCallback, useState } from "react";
import type { z } from "zod";
import { getFieldErrors, type FieldErrors } from "./formSchemas";

type FormValues = Record<string, unknown>;

export function useZodForm<TSchema extends z.ZodType<FormValues>>() {
  type Values = z.input<TSchema>;
  type ParsedValues = z.output<TSchema>;
  type Field = Extract<keyof Values, string>;

  const [errors, setErrors] = useState<FieldErrors<Field>>({});

  const validate = useCallback((schema: TSchema, values: Values): ParsedValues | null => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors<Field>(parsed.error));
      return null;
    }

    setErrors({});
    return parsed.data;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: Field, linkedFields: Field[] = []) => {
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      for (const linkedField of linkedFields) delete next[linkedField];
      return next;
    });
  }, []);

  return {
    errors,
    setErrors,
    validate,
    clearErrors,
    clearFieldError,
  };
}
