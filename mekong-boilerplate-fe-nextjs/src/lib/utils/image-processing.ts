/**
 * DEPRECATED: Utility functions for processing images in forms
 *
 * This file is kept for backward compatibility but is no longer used in the main application flow.
 * Images are now uploaded directly to R2 storage at selection time, and only the R2 URLs are included
 * in the request body when creating staged-products or templates.
 */

/**
 * Checks if a string is a valid blob URL
 * @param url - The URL to check
 * @returns True if the URL is a valid blob URL
 */
export function isValidBlobUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('blob:');
}

/**
 * Converts a blob URL to a base64 string
 * @param blobUrl - The blob URL to convert
 * @returns A promise that resolves to the base64 string or null if conversion fails
 */
export async function convertBlobToBase64(blobUrl: string): Promise<string | null> {
  if (!isValidBlobUrl(blobUrl)) {
    return blobUrl; // Return the original URL if it's not a blob URL
  }

  try {
    // Fetch the blob from the URL
    const response = await fetch(blobUrl);

    if (!response.ok) {

      return null;
    }

    const blob = await response.blob();

    // Use FileReader to convert blob to base64
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };

      reader.onerror = () => {
        reject(new Error('FileReader failed to read the blob'));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null; // Return null instead of throwing to prevent form submission failure
  }
}

/**
 * Process an image object to convert blob URLs to base64
 * @param image - The image object to process
 * @returns A promise that resolves to the processed image object
 */
export async function processImageObject(image: any): Promise<any> {
  // Return early if image is null, undefined, or not an object
  if (!image || typeof image !== 'object') {
    return image;
  }

  // Create a deep copy to avoid modifying the original
  const processedImage = { ...image };

  // Check if we have a blob URL in imageData
  if (processedImage.imageData &&
      typeof processedImage.imageData === 'string') {

    // Only process if it's a blob URL
    if (isValidBlobUrl(processedImage.imageData)) {
      try {
        const base64Data = await convertBlobToBase64(processedImage.imageData);

        if (base64Data) {
          processedImage.imageData = base64Data;
        }
      } catch (error) {
        // Keep the original URL instead of deleting
      }
    }
  } else if (processedImage.url &&
             typeof processedImage.url === 'string' &&
             isValidBlobUrl(processedImage.url)) {
    // Some image objects might use 'url' instead of 'imageData'
    try {
      const base64Data = await convertBlobToBase64(processedImage.url);

      if (base64Data) {
        processedImage.url = base64Data;
      }
    } catch (error) {
      // Keep the original URL instead of deleting
    }
  }

  return processedImage;
}

/**
 * Process an array of image objects to convert blob URLs to base64
 * @param images - The array of image objects to process
 * @returns A promise that resolves to the processed array of image objects
 */
export async function processImages(images: any[]): Promise<any[]> {
  // Return empty array if images is null, undefined, or not an array
  if (!images) {
    return [];
  }

  if (!Array.isArray(images)) {
    return Array.isArray(images) ? images : [];
  }

  if (!images.length) {
    return [];
  }

  const processedImages = [...images];

  // Process each image in the array
  for (let i = 0; i < processedImages.length; i++) {
    try {
      processedImages[i] = await processImageObject(processedImages[i]);
    } catch (error) {
      // Keep the original image instead of removing it
    }
  }

  // Filter out any null or undefined values
  return processedImages.filter(img => img != null);
}

/**
 * Process form data to convert all image blob URLs to base64
 * @param formData - The form data to process
 * @param imageFields - Array of field names that contain images
 * @returns A promise that resolves to the processed form data
 */
export async function processFormImages(formData: any, imageFields: string[] = ['images', 'sizeChart']): Promise<any> {
  // Return early if formData is null, undefined, or not an object
  if (!formData || typeof formData !== 'object') {
    return formData || {};
  }

  // Create a deep copy to avoid modifying the original
  const processedData = { ...formData };

  // Process each image field
  for (const field of imageFields) {
    try {
      // Skip if the field doesn't exist in the form data
      if (!(field in processedData)) {
        continue;
      }

      // Skip if the field value is null or undefined
      if (processedData[field] == null) {
        continue;
      }

      if (field === 'images' || Array.isArray(processedData[field])) {
        // Handle array of images
        processedData[field] = await processImages(processedData[field]);
      } else {
        // Handle single image object (like sizeChart)
        processedData[field] = await processImageObject(processedData[field]);
      }
    } catch (error) {
      // Keep the original field value instead of removing it
    }
  }
  return processedData;
}
