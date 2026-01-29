/**
 * Utility functions for handling property name variations (camelCase/snake_case)
 */

/**
 * Gets a property value from an object, checking both camelCase and snake_case versions of the property name
 * @param obj The object to get the property from
 * @param camelCaseProp The camelCase version of the property name
 * @param defaultValue Optional default value to return if property is not found
 * @returns The property value or default value if not found
 */
export function getProperty<T = any>(
  obj: any,
  camelCaseProp: string,
  defaultValue?: T,
): T | undefined {
  if (!obj) return defaultValue;

  // Convert camelCase to snake_case
  const snakeCaseProp = camelToSnakeCase(camelCaseProp);

  // Check for camelCase property first
  if (obj[camelCaseProp] !== undefined) {
    return obj[camelCaseProp];
  }

  // Then check for snake_case property
  if (obj[snakeCaseProp] !== undefined) {
    return obj[snakeCaseProp];
  }

  // Return default value if neither exists
  return defaultValue;
}

/**
 * Converts a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transforms an object by converting all snake_case keys to camelCase
 * @param obj The object to transform
 * @returns A new object with camelCase keys
 */
export function transformToCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformToCamelCase(item)) as unknown as T;
  }

  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = transformToCamelCase(obj[key]);
    }
  }

  return result as T;
}
