import { apiRequest } from '../api-client';

export interface GenerateImageRequest {
    image: File;
    prompt: string;
}

export interface GenerateImageResponse {
    images: string[];
    count: number;
}

/**
 * Generate/edit image using Gemini AI
 */
export async function generateImage(
    data: GenerateImageRequest,
    token: string,
): Promise<GenerateImageResponse> {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('prompt', data.prompt);

    return apiRequest<GenerateImageResponse>({
        url: '/ai-design/generate-image',
        method: 'POST',
        data: formData,
        token,
        headers: {
            // Let browser set Content-Type with boundary for multipart/form-data
            'Content-Type': undefined,
        },
    });
}
