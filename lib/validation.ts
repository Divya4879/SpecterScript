/**
 * Validation utilities for PDF upload
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file size against maximum allowed size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in megabytes
 * @returns ValidationResult indicating if file size is valid
 */
export function validateFileSize(file: File, maxSizeMB: number): ValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File exceeds ${maxSizeMB} MB limit. Please upload a smaller PDF.`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates file extension is .pdf (case-insensitive)
 * @param file - The file to validate
 * @returns ValidationResult indicating if file extension is valid
 */
export function validatePDFExtension(file: File): ValidationResult {
  const fileName = file.name.toLowerCase();
  
  if (!fileName.endsWith('.pdf')) {
    return {
      isValid: false,
      error: 'Please upload a valid PDF file.'
    };
  }
  
  return { isValid: true };
}

/**
 * Validates file MIME type is PDF
 * @param file - The file to validate
 * @returns ValidationResult indicating if file type is valid
 */
export function validatePDFType(file: File): ValidationResult {
  // Check MIME type
  if (file.type !== 'application/pdf' && file.type !== '') {
    return {
      isValid: false,
      error: 'Please upload a valid PDF file.'
    };
  }
  
  return { isValid: true };
}

/**
 * Performs comprehensive validation on uploaded PDF file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in megabytes
 * @returns ValidationResult with first encountered error or success
 */
export function validatePDFFile(file: File, maxSizeMB: number): ValidationResult {
  // Check extension first
  const extensionResult = validatePDFExtension(file);
  if (!extensionResult.isValid) {
    return extensionResult;
  }
  
  // Check file type
  const typeResult = validatePDFType(file);
  if (!typeResult.isValid) {
    return typeResult;
  }
  
  // Check file size
  const sizeResult = validateFileSize(file, maxSizeMB);
  if (!sizeResult.isValid) {
    return sizeResult;
  }
  
  return { isValid: true };
}
