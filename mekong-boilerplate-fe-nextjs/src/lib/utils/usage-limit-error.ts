import { toast } from 'sonner';

export interface UsageLimitErrorData {
  error: string;
  message: string;
  currentUsage: number;
  limit: number;
  resetDate: string;
  featureType: string;
}

/**
 * Handle usage limit exceeded error and show appropriate toast message
 * @param error - The error object from API response
 * @returns true if it was a usage limit error, false otherwise
 */
export function handleUsageLimitError(error: any): boolean {
  if (error?.response?.data?.error === 'USAGE_LIMIT_EXCEEDED') {
    const errorData: UsageLimitErrorData = error.response.data;

    const resetDate = new Date(errorData.resetDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const featureType = getFeatureTypeDisplayName(errorData.featureType);

    toast.error(
      `Monthly ${featureType} limit exceeded!\n` +
      `Current usage: ${errorData.currentUsage}/${errorData.limit}\n`,
      // +
      //`Limit will reset on: ${resetDate}`,
      {
        duration: 8000,
        description: 'Please upgrade your plan or wait for the next reset cycle.'
      }
    );

    return true;
  }

  return false;
}

/**
 * Convert feature type to display name
 */
function getFeatureTypeDisplayName(featureType: string): string {
  switch (featureType) {
    case 'product upload':
      return 'product upload';
    case 'order fulfillment':
      return 'order fulfillment';
    default:
      return featureType;
  }
}

/**
 * Get usage limit error message for display
 */
export function getUsageLimitErrorMessage(errorData: UsageLimitErrorData): string {
  const resetDate = new Date(errorData.resetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const featureType = getFeatureTypeDisplayName(errorData.featureType);

  return `Monthly ${featureType} limit exceeded! (${errorData.currentUsage}/${errorData.limit}). Limit will reset on: ${resetDate}`;
}
