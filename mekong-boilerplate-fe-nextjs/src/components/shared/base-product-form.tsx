'use client';

import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, UseFormReturn, FieldValues, DefaultValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories, useBrands, useAttributes, useCategoryById, useBrandById } from '@/lib/hooks';
import {
  BasicTab,
  CategoryTab,
  ImagesTab,
  SkusTab
} from '@/components/shared/product-form-tabs';

// Utility function to convert a string path to a type-safe path
export function getTypeSafePath<T extends FieldValues>(path: string): Path<T> {
  return path as Path<T>;
}

// Define the base form context
export interface BaseFormContextType<T extends FieldValues> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateToTab: (tab: string) => void;
  selectedCategoryId: string | null;
  selectedCategoryIdTT: string | null;
  categoriesData: any[] | undefined;
  brandsData: any[] | undefined;
  attributesData: any[] | undefined;
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  isLoadingAttributes: boolean;
  setCategorySearchQuery: (query: string) => void;
  setBrandSearchQuery: (query: string) => void;
  fieldMappings: {
    title: string;
    description: string;
    categoryId: string;
    brandId: string;
    images: string;
    productAttributes: string; // For product attributes in the Category tab
    skus: string;
    packageDimensions: {
      length: string;
      width: string;
      height: string;
      unit: string;
    };
    packageWeight: {
      value: string;
      unit: string;
    };
    sizeChart?: string;
  };
  initialProductAttributes?: Array<{
    id: string;
    name?: string;
    values: Array<{
      id?: string;
      name?: string;
    }>;
  }>;
}

// Define the base form props
export interface BaseProductFormProps<T extends FieldValues> {
  schema: z.ZodType<any>;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  isDuplicate?: boolean;
  cancelPath: string;

  // Render props for customization
  renderBasicTab?: (context: BaseFormContextType<T>) => ReactNode;
  renderCategoryTab?: (context: BaseFormContextType<T>) => ReactNode;
  renderImagesTab?: (context: BaseFormContextType<T>) => ReactNode;
  renderSkusTab?: (context: BaseFormContextType<T>) => ReactNode;

  // Additional props for customization
  additionalTabs?: {
    value: string;
    label: string;
    content: (context: BaseFormContextType<T>) => ReactNode;
  }[];

  // Form field name mappings (to handle different field names between forms)
  fieldMappings: {
    title: string; // 'title' for StagedProduct, 'name' for Template
    description: string;
    categoryId: string;
    brandId: string;
    images: string;
    productAttributes: string; // For product attributes in the Category tab
    skus: string;
    packageDimensions: {
      length: string;
      width: string;
      height: string;
      unit: string;
    };
    packageWeight: {
      value: string;
      unit: string;
    };
    sizeChart?: string;
  };

  // Legacy options - no longer needed but kept for backward compatibility
  imageFields?: string[];
  processImages?: boolean;

  // Shared tab component props
  basicTabProps?: Omit<React.ComponentProps<typeof BasicTab<T>>, 'context'>;
  categoryTabProps?: Omit<React.ComponentProps<typeof CategoryTab<T>>, 'context'>;
  imagesTabProps?: Omit<React.ComponentProps<typeof ImagesTab<T>>, 'context'>;
  skusTabProps?: Omit<React.ComponentProps<typeof SkusTab<T>>, 'context'>;

  // Initial data for restoring selections (used for templates)
  initialProductAttributes?: Array<{
    id: string;
    name?: string;
    values: Array<{
      id?: string;
      name?: string;
    }>;
  }>;
}

export function BaseProductForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  isSubmitting,
  isEditing = false,
  isDuplicate = false,
  cancelPath,
  renderBasicTab,
  renderCategoryTab,
  renderImagesTab,
  renderSkusTab,
  additionalTabs = [],
  fieldMappings,
  imageFields = ['images', 'sizeChart'], // Legacy parameter, kept for backward compatibility
  processImages = true, // Legacy parameter, kept for backward compatibility
  basicTabProps,
  categoryTabProps,
  imagesTabProps,
  skusTabProps,
  initialProductAttributes,
}: BaseProductFormProps<T>) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    defaultValues[fieldMappings.categoryId]?.toString() || null
  );
  const [selectedCategoryIdTT, setSelectedCategoryIdTT] = useState<string | null>(null);

  // State for search queries
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // For editing mode, we need to ensure the selected category/brand are included in the initial fetch
  const initialCategoryId = defaultValues[fieldMappings.categoryId]?.toString();
  const initialBrandId = defaultValues[fieldMappings.brandId]?.toString();

  // Fetch categories and brands with search support
  // When editing, we don't apply search filters initially to ensure selected items are included
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({
    // Only apply search filter if there's an active search query
    ...(categorySearchQuery ? { localName: categorySearchQuery } : {})
  });
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands({
    // Only apply search filter if there's an active search query
    ...(brandSearchQuery ? { brandName: brandSearchQuery } : {})
  });

  // Fetch selected category and brand by ID when editing or duplicating
  const shouldLoadInitialData = isEditing || isDuplicate;
  const {
    data: selectedCategory,
    isLoading: isLoadingSelectedCategory,
    error: selectedCategoryError
  } = useCategoryById(shouldLoadInitialData ? initialCategoryId : null);

  const {
    data: selectedBrand,
    isLoading: isLoadingSelectedBrand,
    error: selectedBrandError
  } = useBrandById(shouldLoadInitialData ? initialBrandId : null);

  // Merge selected items with list data to ensure they're available in dropdowns
  const mergedCategoriesData = useMemo(() => {
    if (!categoriesData) return [];

    // If we have a selected category that's not in the list, add it
    if (selectedCategory && !categoriesData.find(cat => cat.id === selectedCategory.id)) {
      return [selectedCategory, ...categoriesData];
    }

    return categoriesData;
  }, [categoriesData, selectedCategory]);

  const mergedBrandsData = useMemo(() => {
    if (!brandsData) return [];

    // If we have a selected brand that's not in the list, add it
    if (selectedBrand && !brandsData.find(brand => brand.id === selectedBrand.id)) {
      return [selectedBrand, ...brandsData];
    }

    return brandsData;
  }, [brandsData, selectedBrand]);

  // Consolidate loading states
  const consolidatedIsLoadingCategories = isLoadingCategories || isLoadingSelectedCategory;
  const consolidatedIsLoadingBrands = isLoadingBrands || isLoadingSelectedBrand;

  // Determine the category ID for fetching attributes
  // For editing/duplicating: use selectedCategory.idTT if available, otherwise use selectedCategoryIdTT
  // For new forms: use selectedCategoryIdTT (set when user selects a category)
  const categoryIdTTForAttributes = useMemo(() => {
    if (shouldLoadInitialData && selectedCategory?.idTT) {
      return selectedCategory.idTT;
    }
    return selectedCategoryIdTT || undefined;
  }, [shouldLoadInitialData, selectedCategory?.idTT, selectedCategoryIdTT]);

  // Fetch attributes based on the determined category ID
  const { data: attributesData = [], isLoading: isLoadingAttributes } = useAttributes({
    categoryIdTT: categoryIdTTForAttributes
  }, {
    enabled: !!categoryIdTTForAttributes // Fetch attributes when we have a category ID
  });

  // Initialize form with schema and default values
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Handle errors for selected category/brand (after form is initialized)
  useEffect(() => {
    if (selectedCategoryError) {
      toast.error('The selected category no longer exists. Please choose a new category.');
      // Clear the invalid selection
      form.setValue(fieldMappings.categoryId as any, 0 as any);
      setSelectedCategoryId(null);
      setSelectedCategoryIdTT(null);
    }
  }, [selectedCategoryError, form, fieldMappings.categoryId]);

  useEffect(() => {
    if (selectedBrandError) {
      toast.error('The selected brand no longer exists. Please choose a new brand.');
      // Clear the invalid selection
      form.setValue(fieldMappings.brandId as any, 0 as any);
    }
  }, [selectedBrandError, form, fieldMappings.brandId]);

  // For editing/duplicating mode: Set selectedCategoryIdTT immediately when selectedCategory is available
  useEffect(() => {
    if (shouldLoadInitialData && selectedCategory?.idTT && selectedCategoryId) {
      setSelectedCategoryIdTT(selectedCategory.idTT);
    }
  }, [shouldLoadInitialData, selectedCategory?.idTT, selectedCategoryId]);

  // Find the selected category's TikTok ID (idTT) when categories are loaded or selectedCategoryId changes
  useEffect(() => {
    if (categoriesData && selectedCategoryId) {
      const foundCategory = categoriesData.find(cat => String(cat.id) === selectedCategoryId);
      if (foundCategory) {
        setSelectedCategoryIdTT(foundCategory.idTT);
      }
    }
  }, [categoriesData, selectedCategoryId]);

  // For editing/duplicating mode: Set selectedCategoryId immediately from initialCategoryId
  useEffect(() => {
    if (shouldLoadInitialData && initialCategoryId && !selectedCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [shouldLoadInitialData, initialCategoryId, selectedCategoryId]);

  // Initialize selectedCategoryId from defaultValues when categories data is loaded
  // This handles the case where the form initializes before categories are fetched
  useEffect(() => {
    if (categoriesData && initialCategoryId && !selectedCategoryId) {
      const foundCategory = categoriesData.find(cat => String(cat.id) === initialCategoryId);
      if (foundCategory) {
        setSelectedCategoryId(initialCategoryId);
        setSelectedCategoryIdTT(foundCategory.idTT);
      }
    }
  }, [categoriesData, initialCategoryId, selectedCategoryId]);

  // Update selected category ID when form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === fieldMappings.categoryId) {
        if (value[fieldMappings.categoryId]) {
          setSelectedCategoryId(value[fieldMappings.categoryId].toString());

          // Also update the categoryIdTT if categories are already loaded
          if (categoriesData) {
            const selectedCategory = categoriesData.find(cat => String(cat.id) === value[fieldMappings.categoryId].toString());
            if (selectedCategory) {
              setSelectedCategoryIdTT(selectedCategory.idTT);
            }
          }
        } else {
          // If category is deselected, clear both category IDs
          setSelectedCategoryId(null);
          setSelectedCategoryIdTT(null);

          // Clear attributes in the form
          if (fieldMappings.productAttributes) {
            form.setValue(fieldMappings.productAttributes as any, [] as any);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, categoriesData, fieldMappings.categoryId, fieldMappings.productAttributes]);

  // Function to navigate between tabs
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Create context object for render props
  const formContext: BaseFormContextType<T> = {
    form,
    isSubmitting,
    activeTab,
    setActiveTab,
    navigateToTab,
    selectedCategoryId,
    selectedCategoryIdTT,
    categoriesData: mergedCategoriesData,
    brandsData: mergedBrandsData,
    attributesData,
    isLoadingCategories: consolidatedIsLoadingCategories,
    isLoadingBrands: consolidatedIsLoadingBrands,
    isLoadingAttributes,
    setCategorySearchQuery,
    setBrandSearchQuery,
    fieldMappings,
    initialProductAttributes,
  };

  // Handle form submission with image processing
  const handleSubmit = async (data: T) => {
    try {
      // Validate sizeChart field if it exists
      const sizeChartValue = fieldMappings.sizeChart ? data[fieldMappings.sizeChart as keyof T] : undefined;

      const validatedSizeChart = (sizeChartValue && typeof sizeChartValue === 'object' &&
        ('imageUrl' in sizeChartValue || 'r2Key' in sizeChartValue) &&
        ((sizeChartValue as any).imageUrl || (sizeChartValue as any).r2Key))
        ? sizeChartValue
        : undefined;

      // Ensure we have all required fields with default values if needed
      const enhancedData = {
        ...data,
        // Ensure these fields exist with at least empty arrays
        [fieldMappings.images]: data[fieldMappings.images] || [],
        [fieldMappings.productAttributes]: data[fieldMappings.productAttributes] || [],
        [fieldMappings.skus]: data[fieldMappings.skus] || [],
        // Only include sizeChart if it has valid data
        ...(fieldMappings.sizeChart ? { [fieldMappings.sizeChart]: validatedSizeChart } : {})
      };

      // With direct R2 uploads, we no longer need to process images
      // Images are already uploaded to R2 storage and we have the URLs
      const processedData = { ...enhancedData };

      // Verify that we have the onSubmit function
      if (typeof onSubmit !== 'function') {
        return;
      }

      // Call the provided onSubmit function with processed data
      try {
        onSubmit(processedData as T);
      } catch (submitError) {
        // Check if the error is related to validation
        if (submitError instanceof z.ZodError) {
          // Handle validation errors
        }
      }
    } catch (error) {
      // Try to submit the original data as a fallback
      try {
        onSubmit(data);
      } catch (fallbackError) {
        // Fallback submission failed
      }
    }
  };

  return (
    <Form {...form}>
      <form
        id="product-form"
        onSubmit={(e) => {
          e.preventDefault();
          // Directly call handleSubmit with current values to bypass potential React Hook Form issues
          const values = form.getValues();
          handleSubmit(values);
        }}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="skus">Variants</TabsTrigger>
            {additionalTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="mt-6">
            {renderBasicTab
              ? renderBasicTab(formContext)
              : <BasicTab
                  context={formContext}
                  cancelPath={cancelPath}
                  {...basicTabProps}
                />
            }
          </TabsContent>

          {/* Category Tab */}
          <TabsContent value="category" className="mt-6">
            {renderCategoryTab
              ? renderCategoryTab(formContext)
              : <CategoryTab
                  context={formContext}
                  {...categoryTabProps}
                />
            }
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="mt-6">
            {renderImagesTab
              ? renderImagesTab(formContext)
              : <ImagesTab
                  context={formContext}
                  {...imagesTabProps}
                />
            }
          </TabsContent>

          {/* Skus Tab */}
          <TabsContent value="skus" className="mt-6">
            {renderSkusTab
              ? renderSkusTab(formContext)
              : <SkusTab
                  context={formContext}
                  isEditing={isEditing}
                  submitButtonText={isEditing ? 'Update' : 'Create'}
                  {...skusTabProps}
                />
            }
          </TabsContent>

          {/* Additional Tabs */}
          {additionalTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.content(formContext)}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(cancelPath)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => {
              // No need to do anything here as the form's onSubmit will handle it
            }}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
