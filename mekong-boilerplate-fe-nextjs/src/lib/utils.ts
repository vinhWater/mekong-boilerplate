import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';

  // Format the date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
