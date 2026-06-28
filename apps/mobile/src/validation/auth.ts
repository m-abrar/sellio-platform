export function validatePasswordChange(currentPassword: string, password: string, confirmation: string) {
  if (!currentPassword || !password || !confirmation) {
    return 'Enter your current password, new password, and password confirmation.';
  }
  if (password.length < 8) return 'Your new password must contain at least 8 characters.';
  if (password !== confirmation) return 'The password confirmation does not match.';
  if (currentPassword === password) return 'Choose a new password that is different from your current password.';
  return null;
}

export function validateBuyerRegistration(name: string, email: string, password: string, confirmation: string) {
  if (!name.trim() || !email.trim() || !password || !confirmation) {
    return 'Name, email, password, and password confirmation are required.';
  }
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address.';
  if (password.length < 8) return 'Your password must contain at least 8 characters.';
  if (password !== confirmation) return 'The password confirmation does not match.';
  return null;
}
