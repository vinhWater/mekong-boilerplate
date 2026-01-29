/**
 * Safely extracts an error message from various error types
 * @param error - The error object (can be any type)
 * @param fallbackMessage - Default message if no error message can be extracted
 * @returns A string error message safe for display
 */
export function getErrorMessage(error: any, fallbackMessage: string = 'An unexpected error occurred'): string {
  // Handle null/undefined
  if (!error) {
    return fallbackMessage;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle API response errors (Axios style)
  if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
    return error.response.data.message;
  }

  // Handle API response errors with different structure
  if (error?.response?.data?.error && typeof error.response.data.error === 'string') {
    return error.response.data.error;
  }

  // Handle validation errors (array of validation error objects)
  if (error?.response?.data?.message && Array.isArray(error.response.data.message)) {
    const validationErrors = error.response.data.message;
    if (validationErrors.length > 0) {
      // If it's a validation error object with constraints
      if (validationErrors[0]?.constraints) {
        const firstError = validationErrors[0];
        const constraintValues = Object.values(firstError.constraints);
        if (constraintValues.length > 0 && typeof constraintValues[0] === 'string') {
          return constraintValues[0] as string;
        }
      }
      // If it's just an array of strings
      if (typeof validationErrors[0] === 'string') {
        return validationErrors[0];
      }
    }
  }

  // Handle direct message property
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // Handle status text from HTTP responses
  if (error?.response?.statusText && typeof error.response.statusText === 'string') {
    return `${error.response.status}: ${error.response.statusText}`;
  }

  // Handle generic error with status
  if (error?.status && error?.statusText) {
    return `${error.status}: ${error.statusText}`;
  }

  // Last resort: try to stringify if it's a simple object
  if (typeof error === 'object' && error !== null) {
    try {
      const stringified = JSON.stringify(error);
      // Only return stringified version if it's reasonably short and readable
      if (stringified.length < 200 && !stringified.includes('[object Object]')) {
        return stringified;
      }
    } catch {
      // JSON.stringify failed, fall through to fallback
    }
  }

  return fallbackMessage;
}
