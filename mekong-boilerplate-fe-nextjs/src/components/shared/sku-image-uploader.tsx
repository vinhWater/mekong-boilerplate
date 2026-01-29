'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { shouldOptimizeImage } from '@/lib/image-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { ImageIcon, Trash2, ExternalLink, FileUp, Link, Loader2 } from 'lucide-react';
import { useUploadFileToR2 } from '@/lib/hooks/use-image-upload-query';

// Define interface for SKU image
export interface SkuImage {
  imageUrl?: string;
  r2Key?: string;
}

interface SkuImageUploaderProps {
  image?: SkuImage;
  onChange: (image: SkuImage | undefined) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  folder?: string; // Optional folder path for R2 uploads (e.g., 'templates', 'uploads')
}

export function SkuImageUploader({
  image,
  onChange,
  disabled = false,
  size = 'md',
  folder
}: SkuImageUploaderProps) {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'file' | 'url'>('url');
  const [hasUrlValue, setHasUrlValue] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // React Query hook for file upload
  const uploadFileMutation = useUploadFileToR2();

  // Create a ref for the URL input to handle it in an uncontrolled way
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      // Upload file to R2 storage first
      const uploadResult = await uploadFileMutation.mutateAsync({
        file: files[0],
        folder
      });

      // Create new image with the R2 URL
      const newImage: SkuImage = {
        imageUrl: uploadResult.url,
        r2Key: uploadResult.key,
      };

      onChange(newImage);
      setIsAddingImage(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
      // Reset input to allow selecting the same file again
      e.target.value = '';
    }
  };

  // Handle adding image from URL
  const handleAddImageFromUrl = async () => {
    const url = urlInputRef.current?.value || '';
    if (!url.trim()) return;

    try {
      setIsUploading(true);

      // Create a new image with the URL
      const newImage: SkuImage = {
        imageUrl: url,
      };

      onChange(newImage);

      // Reset the input field
      if (urlInputRef.current) {
        urlInputRef.current.value = '';
      }
      setHasUrlValue(false);
      setIsAddingImage(false);
    } catch (error) {
      console.error('Error processing URL image:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    onChange(undefined);
  };

  // Open dialog to add image
  const openAddImageDialog = () => {
    setImageUploadType('url');
    // Reset URL input if it exists
    if (urlInputRef.current) {
      urlInputRef.current.value = '';
    }
    setHasUrlValue(false);
    setIsAddingImage(true);
  };

  // Handle dialog close to reset state
  const handleDialogOpenChange = (open: boolean) => {
    setIsAddingImage(open);
    if (!open) {
      // Reset state when dialog closes
      if (urlInputRef.current) {
        urlInputRef.current.value = '';
      }
      setHasUrlValue(false);
      setImageUploadType('url');
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'lg':
        return 'w-24 h-24';
      default:
        return 'w-16 h-16';
    }
  };



  return (
    <div className="flex items-center">
      {image?.imageUrl ? (
        <div className="relative group">
          <div className={`${getSizeClasses()} relative border rounded-md overflow-hidden cursor-pointer`}>
            <Image
              src={image.imageUrl || "/placeholder.svg"}
              alt="SKU image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 12vw, (max-width: 1024px) 8vw, 6vw"
              unoptimized={!shouldOptimizeImage(image.imageUrl || "/placeholder.svg")}
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => window.open(image.imageUrl, "_blank")}
              type="button"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={handleRemoveImage}
              disabled={disabled}
              type="button"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`${getSizeClasses()} border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={disabled ? undefined : openAddImageDialog}
          title="Click to add image"
        >
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Dialog for adding images */}
      <Dialog open={isAddingImage} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add SKU Image</DialogTitle>
            <DialogDescription>
              Upload an image from your device or add from URL.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <RadioGroup
              defaultValue="url"
              value={imageUploadType}
              onValueChange={(value) => {
                setImageUploadType(value as 'file' | 'url');
                // Reset the URL input when switching to file upload
                if (value === 'file' && urlInputRef.current) {
                  urlInputRef.current.value = '';
                  setHasUrlValue(false);
                }
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="url" id="url-upload" className="peer sr-only" />
                <Label
                  htmlFor="url-upload"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Link className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Image URL</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="file" id="file-upload" className="peer sr-only" />
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FileUp className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Upload File</span>
                </Label>
              </div>
            </RadioGroup>

            {imageUploadType === 'file' ? (
              <div className="grid gap-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                  disabled={isUploading}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, GIF. Max size: 10MB.</p>
                  {isUploading && (
                    <div className="flex items-center text-xs text-primary">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Uploading...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  ref={urlInputRef}
                  defaultValue=""
                  onChange={(e) => setHasUrlValue(!!e.target.value.trim())}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a valid image URL. Make sure you have permission to use this image.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            {imageUploadType === 'url' && (
              <Button
                type="button"
                onClick={handleAddImageFromUrl}
                disabled={!hasUrlValue || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  'Add Image'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
