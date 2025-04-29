import { FormField, FormData, FormErrors, FormSection } from "../types";

export const validateField = (field: FormField, value: any): string | null => {
  const { required, type, minLength, maxLength, validation } = field;

  // Required field validation
  if (required && (value === undefined || value === null || value === "")) {
    return validation?.message || "This field is required";
  }

  // Skip further validation if field is empty but not required
  if (!value && !required) {
    return null;
  }

  // String validations
  if (typeof value === "string") {
    // Min length validation
    if (minLength !== undefined && value.length < minLength) {
      return `Minimum length is ${minLength} characters`;
    }

    // Max length validation
    if (maxLength !== undefined && value.length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }

    // Email validation
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    // Phone validation
    if (type === "tel" && !/^\d{10}$/.test(value)) {
      return "Please enter a valid 10-digit phone number";
    }
  }

  return null;
};

export const validateSection = (section: FormSection, formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  section.fields.forEach((field) => {
    const value = formData[field.fieldId];
    const error = validateField(field, value);
    
    if (error) {
      errors[field.fieldId] = error;
    }
  });

  return errors;
};

export const isSectionValid = (section: FormSection, formData: FormData): boolean => {
  const errors = validateSection(section, formData);
  return Object.keys(errors).length === 0;
};