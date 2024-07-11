export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 10) return 'Password must be at least 10 characters long.'
  if (password.length > 30) return 'Password must be less than 30 characters long.'
  if(!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
  return ''
}

export function confirmValidator(password, confirmPassword) {
  if (!confirmPassword) return "Confirm password can't be empty.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

