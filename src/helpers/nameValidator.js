export function nameValidator(name) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "Name can't be empty.";
  }

  const minLength = 2;
  if (trimmedName.length < minLength) {
    return `Name must be at least ${minLength} characters long.`;
  }

  const maxLength = 50;
  if (trimmedName.length > maxLength) {
    return `Name must be less than ${maxLength} characters long.`;
  }

  if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
    return "Name must contain only letters and spaces.";
  }


  if (trimmedName[0] !== trimmedName[0].toUpperCase()) {
    return "The first letter of the name must be capitalized.";
  }

  return "";
}
