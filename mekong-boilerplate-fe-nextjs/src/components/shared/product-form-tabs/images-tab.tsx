'use client';

import { FieldValues, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductImageUploader, ProductImage } from '@/components/staged-products/product-image-uploader';
import { BaseFormContextType, getTypeSafePath } from '@/components/shared/base-product-form';

export interface ImagesTabProps<T extends FieldValues> {
  context: BaseFormContextType<T>;
  title?: string;
  imagesLabel?: string;
  imagesDescription?: string;
  sizeChartLabel?: string;
  sizeChartDescription?: string;
  maxImages?: number;
  prevTabId?: string;
  nextTabId?: string;
  onPrev?: () => void;
  onNext?: () => void;
  uploadFolder?: string; // Optional folder path for R2 uploads (e.g., 'templates', 'uploads')
}

export function ImagesTab<T extends FieldValues>({
  context,
  title = 'Product Images & Size Chart',
  imagesLabel = 'Product Images',
  imagesDescription = 'Upload up to 9 high-quality images of your product. The first image will be used as the cover image.',
  sizeChartLabel = 'Size Chart Image',
  sizeChartDescription = 'Upload a size chart image to help customers choose the right size.',
  maxImages = 9,
  prevTabId = 'category',
  nextTabId = 'skus',
  onPrev,
  onNext,
  uploadFolder,
}: ImagesTabProps<T>) {
  const { form, navigateToTab, fieldMappings } = context;

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    navigateToTab(prevTabId);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    navigateToTab(nextTabId);
  };

  return (
    <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={getTypeSafePath<T>(fieldMappings.images)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{imagesLabel}</FormLabel>
              <FormControl>
                <ProductImageUploader
                  images={(field.value || []).map((img: any) => ({
                    id: img.r2Key || img.imageUrl || String(Math.random()),
                    type: 'url', // All images are now URLs (either external or R2)
                    src: img.imageUrl || '',
                    r2Key: img.r2Key,
                  }))}
                  onChange={(images: ProductImage[]) => {
                    // Convert ProductImage[] to appropriate format for the form
                    const imageInputs = images.map(img => ({
                      imageUrl: img.src,
                      r2Key: img.r2Key,
                    }));
                    field.onChange(imageInputs);
                  }}
                  maxImages={maxImages}
                  folder={uploadFolder}
                />
              </FormControl>
              <FormDescription>
                {imagesDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6 border-t mt-6">
          <FormField
            control={form.control}
            name={getTypeSafePath<T>(fieldMappings.sizeChart || '')}
            render={({ field }) => {
              // Use useWatch to get reactive value that triggers re-render
              const fieldName = getTypeSafePath<T>(fieldMappings.sizeChart || '');
              const watchedValue = useWatch({
                control: form.control,
                name: fieldName,
              });

              // Check if watched value has valid image data
              const hasValidImage = watchedValue &&
                (watchedValue.imageUrl || watchedValue.r2Key);

              return (
                <FormItem>
                  <FormLabel>{sizeChartLabel}</FormLabel>
                  <FormControl>
                    <ProductImageUploader
                      images={hasValidImage ? [
                        {
                          id: watchedValue.r2Key || watchedValue.imageUrl || String(Math.random()),
                          type: 'url', // All images are now URLs (either external or R2)
                          src: watchedValue.imageUrl || '',
                          r2Key: watchedValue.r2Key,
                        }
                      ] : []}
                      onChange={(images: ProductImage[]) => {
                        if (images.length === 0) {
                          // If no images, set to undefined
                          field.onChange(undefined);

                          // Also use form.setValue to ensure the value is updated
                          const fieldName = getTypeSafePath<T>(fieldMappings.sizeChart || '');
                          form.setValue(fieldName, undefined as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true
                          });
                        } else {
                          // Convert ProductImage to appropriate format
                          const img = images[0]; // Only take the first image
                          const newValue = {
                            imageUrl: img.src,
                            r2Key: img.r2Key,
                          };
                          field.onChange(newValue);
                        }
                      }}
                      maxImages={1}
                      folder={uploadFolder}
                    />
                  </FormControl>
                  <FormDescription>
                    {sizeChartDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          type="button"
        >
          Back: Category
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Variants
        </Button>
      </CardFooter>
    </Card>
  );
}
