import { apiRequest } from '../api-client';
import { getSession } from 'next-auth/react';

/**
 * Response type for design file upload
 */
export interface DesignUploadResponse {
    id: number;
    filename: string;
    size: number;
    url: string;
    r2Key: string;
    mimetype: string;
    thumbnailUrl: string | null;
    thumbnailR2Key: string | null;
    uploadedAt: string;
}

/**
 * Upload a design file to R2 storage via /designs/upload endpoint
 * @param file The file to upload
 * @param token Authentication token
 * @returns Promise with the uploaded file information
 */
export const uploadDesignFile = async (
    file: File,
    token?: string,
): Promise<DesignUploadResponse> => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Make the API request
    return apiRequest<DesignUploadResponse>({
        method: 'POST',
        url: 'designs/upload',
        data: formData,
        token: token,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Design file response type
 */
export interface DesignFileResponse {
    id: number;
    managerId: number;
    filename: string;
    size: number;
    url: string;
    r2Key: string;
    mimetype: string;
    thumbnailUrl: string | null;
    thumbnailR2Key: string | null;
    uploadedAt: string;
    updatedAt: string;
}

/**
 * Paginated design files list response
 */
export interface DesignFilesListResponse {
    data: DesignFileResponse[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Get all design files for the user with pagination
 * @param token Authentication token
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 50)
 * @param filename Optional filename filter (partial match, case-insensitive)
 * @param sortField Optional sort field ('filename' or 'uploadedAt')
 * @param sortDirection Optional sort direction ('asc' or 'desc')
 * @returns Promise with paginated design files list
 */
export const getDesignFiles = async (
    token: string,
    page: number = 1,
    limit: number = 50,
    filename?: string,
    sortField?: string,
    sortDirection?: string,
): Promise<DesignFilesListResponse> => {
    let url = `designs?page=${page}&limit=${limit}`;
    if (filename && filename.trim()) {
        url += `&filename=${encodeURIComponent(filename.trim())}`;
    }
    if (sortField) {
        url += `&sortField=${encodeURIComponent(sortField)}`;
    }
    if (sortDirection) {
        url += `&sortDirection=${encodeURIComponent(sortDirection)}`;
    }

    return apiRequest<DesignFilesListResponse>({
        method: 'GET',
        url: url,
        token: token,
    });
};

/**
 * Update design file metadata
 * @param id Design file ID
 * @param filename New filename
 * @param token Authentication token
 * @returns Promise with updated design file
 */
export const updateDesignFile = async (
    id: number,
    filename: string,
    token: string,
): Promise<DesignFileResponse> => {
    return apiRequest<DesignFileResponse>({
        method: 'PUT',
        url: `designs/${id}`,
        data: { filename },
        token: token,
    });
};

/**
 * Delete design file
 * @param id Design file ID
 * @param token Authentication token
 * @returns Promise with success message
 */
export const deleteDesignFile = async (
    id: number,
    token: string,
): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>({
        method: 'DELETE',
        url: `designs/${id}`,
        token: token,
    });
};

/**
 * Add design file from URL
 * @param url Image URL
 * @param filename Optional custom filename (without extension)
 * @param token Authentication token
 * @returns Promise with design file info
 */
export const addDesignFromUrl = async (
    url: string,
    token: string,
    filename?: string,
): Promise<DesignUploadResponse> => {
    const payload: { url: string; filename?: string } = { url };
    if (filename && filename.trim()) {
        payload.filename = filename.trim();
    }

    return apiRequest<DesignUploadResponse>({
        method: 'POST',
        url: 'designs/add-from-url',
        data: payload,
        token: token,
    });
};

/**
 * Response type for design import job
 */
export interface DesignImportJobResponse {
    jobId: string;
    message?: string;
    totalRows: number;
}

/**
 * Import designs from CSV file
 * @param file CSV file to import
 * @param token Authentication token
 * @returns Promise with import job info
 */
export const importDesignsFromCsv = async (
    file: File,
    token: string,
): Promise<DesignImportJobResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<DesignImportJobResponse>({
        method: 'POST',
        url: 'designs/import-csv',
        data: formData,
        token: token,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
