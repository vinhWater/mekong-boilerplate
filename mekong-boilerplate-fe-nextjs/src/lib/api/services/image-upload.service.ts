import { apiRequest } from '../api-client';
import { UploadFileToR2Response } from '@/types/image-upload';
import { getSession } from 'next-auth/react';

/**
 * Upload a file to R2 storage
 * @param file The file to upload
 * @param token Optional authentication token
 * @param folder Optional folder path (e.g., 'templates', 'uploads'). If not provided, backend uses default 'uploads' folder.
 * @returns Promise with the uploaded file information
 */
export const uploadFileToR2 = async (file: File, token?: string, folder?: string): Promise<UploadFileToR2Response> => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file);

  // Add folder parameter if provided
  if (folder) {
    formData.append('folder', folder);
  }

  // Make the API request
  return apiRequest<UploadFileToR2Response>({
    method: 'POST',
    url: 'products/images/upload-to-r2',
    data: formData,
    token: token, // Include the token for authentication
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Upload multiple files to R2 storage
 * @param files Array of files to upload
 * @param token Optional authentication token
 * @param folder Optional folder path (e.g., 'templates', 'uploads'). If not provided, backend uses default 'uploads' folder.
 * @returns Promise with array of uploaded file information
 */
export const uploadMultipleFilesToR2 = async (files: File[], token?: string, folder?: string): Promise<UploadFileToR2Response[]> => {
  // Create an array of promises for each file upload
  const uploadPromises = files.map((file) => uploadFileToR2(file, token, folder));

  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
};
