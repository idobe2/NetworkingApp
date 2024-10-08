export function emailValidator(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return "Email can't be empty."
  if (!emailPattern.test(email)) return 'Ooops! We need a valid email address.'
  return ''
}
