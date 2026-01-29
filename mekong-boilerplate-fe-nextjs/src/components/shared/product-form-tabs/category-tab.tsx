'use client';

import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
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
import { ComboboxServer } from '@/components/ui/combobox-server';
import { AttributeSelector, ProductAttribute } from '@/components/staged-products/attribute-selector';
import { BaseFormContextType, getTypeSafePath } from '@/components/shared/base-product-form';

export interface CategoryTabProps<T extends FieldValues> {
  context: BaseFormContextType<T>;
  categoryLabel?: string;
  categoryDescription?: string;
  brandLabel?: string;
  brandDescription?: string;
  attributesLabel?: string;
  attributesDescription?: string;
  prevTabId?: string;
  nextTabId?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export function CategoryTab<T extends FieldValues>({
  context,
  categoryLabel = 'Category',
  categoryDescription = 'The category your product belongs to.',
  brandLabel = 'Brand',
  brandDescription = 'The brand of your product (if applicable).',
  attributesLabel = 'Product Attributes',
  attributesDescription = 'Select the appropriate attributes for your product based on the category.',
  prevTabId = 'basic',
  nextTabId = 'images',
  onPrev,
  onNext,
}: CategoryTabProps<T>) {
  const {
    form,
    navigateToTab,
    fieldMappings,
    categoriesData,
    brandsData,
    attributesData,
    isLoadingCategories,
    isLoadingBrands,
    isLoadingAttributes,
    selectedCategoryIdTT,
    setCategorySearchQuery,
    setBrandSearchQuery,
    initialProductAttributes
  } = context;

  // Convert initialProductAttributes to selectedAttributes format for AttributeSelector
  const selectedAttributes = useMemo((): ProductAttribute[] => {
    if (!attributesData || !initialProductAttributes || initialProductAttributes.length === 0) {
      return [];
    }

    // Map the template's productAttributes to the format expected by AttributeSelector
    return initialProductAttributes
      .map(templateAttr => {
        // Find the corresponding attribute from the API data
        const apiAttribute = attributesData.find(attr => attr.idTT === templateAttr.id);

        if (!apiAttribute) {
          // Skip if attribute not found in current category
          return null;
        }

        // Convert template's attribute values to selectedValues (array of idTT strings)
        const selectedValues = templateAttr.values
          .map(templateValue => {
            // Try to find the value by id first, then by name as fallback
            const apiValue = apiAttribute.values.find((v: any) => {
              // First try exact match on idTT
              if (templateValue.id && v.idTT === templateValue.id) {
                return true;
              }
              // Then try exact match on name
              if (templateValue.name && v.name === templateValue.name) {
                return true;
              }
              return false;
            });
            return apiValue?.idTT;
          })
          .filter((idTT): idTT is string => Boolean(idTT)); // Type-safe filter

        // Only include attributes that have at least one selected value
        if (selectedValues.length === 0) {
          return null;
        }

        return {
          ...apiAttribute,
          selectedValues
        };
      })
      .filter((attr): attr is ProductAttribute => attr !== null); // Type-safe filter
  }, [attributesData, initialProductAttributes]);

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
        <CardTitle>Category & Attributes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={getTypeSafePath<T>(fieldMappings.categoryId)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{categoryLabel}</FormLabel>
                <FormControl>
                  <ComboboxServer
                    options={(categoriesData || []).map((category) => ({
                      value: String(category.id),
                      label: category.localName || category.name || ""
                    }))}
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                    placeholder="Select a category"
                    searchPlaceholder="Search categories..."
                    emptyMessage="No category found."
                    disabled={isLoadingCategories}
                    isLoading={isLoadingCategories}
                    onSearch={setCategorySearchQuery}
                  />
                </FormControl>
                <FormDescription>
                  {categoryDescription}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={getTypeSafePath<T>(fieldMappings.brandId)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{brandLabel}</FormLabel>
                <FormControl>
                  <ComboboxServer
                    options={(brandsData || []).map((brand) => ({
                      value: String(brand.id),
                      label: brand.name || ""
                    }))}
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                    placeholder="Select a brand"
                    searchPlaceholder="Search brands..."
                    emptyMessage="No brand found."
                    disabled={isLoadingBrands}
                    isLoading={isLoadingBrands}
                    onSearch={setBrandSearchQuery}
                  />
                </FormControl>
                <FormDescription>
                  {brandDescription}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Only show attributes section when a category is selected */}
        {selectedCategoryIdTT ? (
          <FormField
            control={form.control}
            name={getTypeSafePath<T>(fieldMappings.productAttributes)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attributesLabel}</FormLabel>
                <FormControl>
                  {isLoadingAttributes ? (
                    <div className="flex items-center justify-center p-8 border rounded-lg">
                      <p>Loading attributes for the selected category...</p>
                    </div>
                  ) : (attributesData || []).length === 0 ? (
                    <div className="flex items-center justify-center p-8 border rounded-lg">
                      <p>No attributes available for the selected category. Please select a different category.</p>
                    </div>
                  ) : (
                    <AttributeSelector
                      attributes={attributesData || []}
                      selectedAttributes={(() => {
                        // Use form field value if it exists and has selections, otherwise use computed selectedAttributes
                        const result = (field.value && field.value.length > 0)
                          ? (field.value as any[])
                          : selectedAttributes;
                        return result;
                      })()}
                      onChange={(attrs: any) => {
                        field.onChange(attrs);
                      }}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {attributesDescription}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="flex items-center justify-center p-8 border rounded-lg">
            <p>Please select a category to view available attributes.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          type="button"
        >
          Back: Basic
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Images
        </Button>
      </CardFooter>
    </Card>
  );
}
