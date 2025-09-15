export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateLead = (lead: {
  name: string;
  email: string;
  company: string;
}) => {
  const errors: Record<string, string> = {};

  if (!lead.name.trim()) {
    errors.name = "Name is required";
  }

  if (!lead.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(lead.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!lead.company.trim()) {
    errors.company = "Company is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
