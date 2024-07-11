

export const ageValidator = (selectedDate) => {
    if (!selectedDate) {
      return "Birth date is required.";
    }
  
    const today = new Date();
    const birthDate = new Date(selectedDate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (age < 13) {
      return "You must be at least 13 years old.";
    }
  
    return "";
  };
  