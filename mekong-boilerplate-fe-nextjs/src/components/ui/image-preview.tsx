'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { shouldOptimizeImage } from '@/lib/image-loader';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ZoomIn, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  /** Image URL to display */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Product name for modal title (screen readers only) */
  productName?: string;
  /** Optional styling classes for the thumbnail */
  className?: string;
  /** Configurable thumbnail dimensions */
  thumbnailSize?: string;
  /** Optional custom fallback icon component */
  fallbackIcon?: React.ReactNode;
  /** Additional props to pass to the thumbnail image */
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  /** Callback when image fails to load */
  onError?: () => void;
}

export function ImagePreview({
  src,
  alt,
  productName,
  className,
  thumbnailSize = 'w-12 h-12',
  fallbackIcon,
  imageProps,
  onError
}: ImagePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen && event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  const handleImageClick = (event: React.MouseEvent) => {
    // Prevent event bubbling to parent elements (like table rows)
    event.stopPropagation();
    if (!hasError && src) {
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      handleImageClick(event as any);
    }
  };

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const defaultFallbackIcon = fallbackIcon || <Package className="h-6 w-6 text-muted-foreground" />;

  return (
    <>
      {/* Thumbnail Image */}
      <div className="flex-shrink-0">
        {src && !hasError ? (
          <div
            className={cn(
              "relative group cursor-pointer",
              thumbnailSize,
              className
            )}
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            aria-label={`View full size image of ${productName || alt}`}
            onKeyDown={handleKeyDown}
            data-image-preview="true"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className={cn(
                "object-cover rounded-md border transition-all duration-200 group-hover:scale-105"
              )}
              onError={handleImageError}
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-1.5 backdrop-blur-sm">
                <ZoomIn className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "bg-muted rounded-md border flex items-center justify-center",
            thumbnailSize,
            className
          )}>
            {defaultFallbackIcon}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] sm:w-full p-0 border-0">
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            Product Image Preview: {productName || alt}
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center bg-black/95 rounded-lg overflow-hidden min-h-[400px]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="95vw"
              unoptimized={!shouldOptimizeImage(src)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) errorDiv.style.display = 'flex';
              }}
            />
            {/* Error fallback */}
            <div className="hidden w-full h-96 items-center justify-center flex-col">
              <Package className="h-16 w-16 text-white/60 mb-4" />
              <p className="text-white/60">Failed to load image</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImagePreview;
