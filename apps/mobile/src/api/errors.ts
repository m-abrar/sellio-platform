export type ValidationErrors = Record<string, string[]>;

export function firstValidationMessage(errors?: ValidationErrors | null) {
  if (!errors) return null;
  return Object.values(errors).flat().find(Boolean) || null;
}

export function responseErrorMessage(
  status: number,
  message?: string | null,
  errors?: ValidationErrors | null,
) {
  return firstValidationMessage(errors) || message || `Request failed (${status}).`;
}
