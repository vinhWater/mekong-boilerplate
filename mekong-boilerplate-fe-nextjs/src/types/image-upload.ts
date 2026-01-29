/**
 * Response from the uploadFileToR2 endpoint
 */
export interface UploadFileToR2Response {
  /**
   * The URL of the uploaded file
   */
  url: string;
  
  /**
   * The R2 storage key of the uploaded file
   */
  key: string;
  
  /**
   * The original filename
   */
  filename?: string;
  
  /**
   * The size of the file in bytes
   */
  size?: number;
  
  /**
   * The MIME type of the file
   */
  mimetype?: string;
}
