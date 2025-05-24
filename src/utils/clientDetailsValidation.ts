// utils/clientDetailsValidation.ts

export interface ClientDetailsFormData {
  nationality: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  identityType: string;
  identityFront: File | null;
  identityBack: File | null;
}

export interface DocumentData {
  nationality: string;
  dob: string; // ISO date string
  docType: 'passport' | 'license' | 'id_card' | string; // Adjust enum values as needed
  docId_01?: string;
  docId_02?: string;
}

export interface ValidationErrors {
  nationality?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  identityType?: string;
  identityFront?: string;
  identityBack?: string;
  submit?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates a phone number format
 * @param phoneNumber - The phone number to validate
 * @returns True if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Calculates age from date of birth
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Validates file type and size
 * @param file - The file to validate
 * @returns Object with isValid boolean and error message
 */
export const validateFile = (file: File): FileValidationResult => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload a valid image (JPG, PNG) or PDF file"
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size must be less than 5MB"
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates all form data for client details
 * @param formData - The form data to validate
 * @returns Object with validation errors
 */
export const validateClientDetailsForm = (formData: ClientDetailsFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate nationality
  if (!formData.nationality) {
    errors.nationality = "Nationality is required";
  }

  // Validate phone number
  if (!formData.phoneNumber) {
    errors.phoneNumber = "Phone number is required";
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  // Validate date of birth
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      errors.dateOfBirth = "You must be at least 18 years old";
    }
  }

  // Validate identity type
  if (!formData.identityType) {
    errors.identityType = "Identity document type is required";
  }

  // Validate identity document front
  if (!formData.identityFront) {
    errors.identityFront = "Front side of identity document is required";
  }

  // Validate identity document back
  if (!formData.identityBack) {
    errors.identityBack = "Back side of identity document is required";
  }

  return errors;
};

/**
 * Checks if form has any validation errors
 * @param errors - The errors object
 * @returns True if form is valid (no errors), false otherwise
 */
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};