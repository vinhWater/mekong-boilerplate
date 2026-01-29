'use client';

import { useState, useEffect } from 'react';
import { FieldValues, useFieldArray, FieldArray, ArrayPath } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, RefreshCw, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BaseFormContextType, getTypeSafePath } from '@/components/shared/base-product-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useGenerateSkusFromGearment } from '@/lib/hooks';
import { toast } from 'sonner';
import { SkuImageUploader, SkuImage } from '@/components/shared/sku-image-uploader';


export interface SkusTabProps<T extends FieldValues> {
  context: BaseFormContextType<T>;
  title?: string;
  placeholder?: React.ReactNode;
  prevTabId?: string;
  isEditing?: boolean;
  onPrev?: () => void;
  submitButtonText?: string;
  loadingButtonText?: string;
  uploadFolder?: string; // Optional folder path for R2 uploads (e.g., 'templates', 'uploads')
}

export function SkusTab<T extends FieldValues>({
  context,
  title = 'Product Variants (SKUs)',
  placeholder = <p>No variants have been added yet. Add variants to create different combinations of your product.</p>,
  prevTabId = 'images',
  isEditing = false,
  onPrev,
  submitButtonText,
  loadingButtonText = 'Saving...',
  uploadFolder,
}: SkusTabProps<T>) {
  const { navigateToTab, isSubmitting, form, fieldMappings } = context;
  const [isGeneratingSkus, setIsGeneratingSkus] = useState<boolean>(false);
  const [selectedGearmentType, setSelectedGearmentType] = useState<string>('');
  const [bulkPrice, setBulkPrice] = useState<string>('');
  const [bulkQuantity, setBulkQuantity] = useState<string>('');
  const [bulkImage, setBulkImage] = useState<SkuImage | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Local state for SKU attributes (independent from form data)
  const [skuAttributes, setSkuAttributes] = useState<Array<{
    id: string;
    name: string;
    valueNames: string[];
  }>>([]);

  // Get the skus field array from the form
  const skusPath = getTypeSafePath<T>(fieldMappings.skus as string) as ArrayPath<T>;

  const {
    fields: skuFields,
    // We're not using append anymore since we're using replace for better performance
    // append: appendSku,
    remove: removeSku,
    update: updateSku,
    replace: replaceSkus
  } = useFieldArray({ control: form.control, name: skusPath });

  // Initialize SKU attributes from existing SKUs when component mounts or SKUs change
  useEffect(() => {
    if (skuFields.length > 0) {
      // Extract unique attribute names and their values from all SKUs
      const attributeMap = new Map<string, Set<string>>();

      skuFields.forEach((_, index) => {
        const skuData = form.getValues(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}`)) as any;
        if (skuData?.salesAttributes) {
          skuData.salesAttributes.forEach((attr: { name: string; valueName: string }) => {
            if (!attributeMap.has(attr.name)) {
              attributeMap.set(attr.name, new Set());
            }
            attributeMap.get(attr.name)?.add(attr.valueName);
          });
        }
      });

      // Convert to the format expected by our local state
      const extractedAttributes = Array.from(attributeMap.entries()).map(([name, valueSet], index) => ({
        id: `attr-${index}`,
        name,
        valueNames: Array.from(valueSet)
      }));

      setSkuAttributes(extractedAttributes);
    }
  }, [skuFields.length, form, fieldMappings.skus]);

  // Extract available colors and sizes from local attributes
  useEffect(() => {
    const colorAttr = skuAttributes.find(attr => attr.name?.toLowerCase() === 'color');
    const sizeAttr = skuAttributes.find(attr => attr.name?.toLowerCase() === 'size');

    if (colorAttr && colorAttr.valueNames) {
      setAvailableColors(colorAttr.valueNames);
    } else {
      setAvailableColors([]);
    }

    if (sizeAttr && sizeAttr.valueNames) {
      setAvailableSizes(sizeAttr.valueNames);
    } else {
      setAvailableSizes([]);
    }
  }, [skuAttributes]);

  // Handle "select all" checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedSkus(skuFields.map((_, index) => index));
    } else {
      setSelectedSkus([]);
    }
  }, [selectAll, skuFields]);

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    navigateToTab(prevTabId);
  };

  const handleAddAttribute = () => {
    const newAttribute = {
      id: `attr-${Date.now()}`,
      name: '',
      valueNames: []
    };
    setSkuAttributes(prev => [...prev, newAttribute]);
  };

  const handleRemoveAttribute = (index: number) => {
    setSkuAttributes(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddAttributeValue = (attrIndex: number, value: string) => {
    setSkuAttributes(prev => prev.map((attr, index) => {
      if (index === attrIndex) {
        return {
          ...attr,
          valueNames: [...attr.valueNames, value]
        };
      }
      return attr;
    }));
  };

  const handleRemoveAttributeValue = (attrIndex: number, valueIndex: number) => {
    setSkuAttributes(prev => prev.map((attr, index) => {
      if (index === attrIndex) {
        const newValueNames = [...attr.valueNames];
        newValueNames.splice(valueIndex, 1);
        return {
          ...attr,
          valueNames: newValueNames
        };
      }
      return attr;
    }));
  };

  const handleUpdateAttributeName = (attrIndex: number, name: string) => {
    setSkuAttributes(prev => prev.map((attr, index) => {
      if (index === attrIndex) {
        return {
          ...attr,
          name
        };
      }
      return attr;
    }));
  };

  const handleGenerateSkus = () => {
    if (skuAttributes.length < 1) {
      toast.error('Please add at least one attribute to generate SKUs');
      return;
    }

    // Clear existing SKUs by replacing with an empty array
    replaceSkus([]);

    // Generate all possible combinations of attribute values
    // This approach collects all combinations first, then adds them all at once
    const generateAllCombinations = (attributes: Array<{ name: string; valueNames: string[] }>) => {
      const allSkus: Array<FieldArray<T, ArrayPath<T>>> = [];

      const generateCombinations = (
        attributes: Array<{ name: string; valueNames: string[] }>,
        currentIndex: number,
        currentCombination: Array<{ name: string; value: string }> = []
      ) => {
        if (currentIndex === attributes.length) {
          // Create a new SKU with this combination
          const salesAttributes = currentCombination.map(item => ({
            name: item.name.toLowerCase(),
            valueName: item.value,
          }));

          allSkus.push({
            salesAttributes,
            inventory: {
              quantity: 100,
            },
            price: {
              currency: 'USD',
            },
          } as unknown as FieldArray<T, ArrayPath<T>>);
          return;
        }

        const attribute = attributes[currentIndex];
        const valueNames = attribute.valueNames || [];

        for (const value of valueNames) {
          generateCombinations(
            attributes,
            currentIndex + 1,
            [...currentCombination, { name: attribute.name, value }]
          );
        }
      };

      generateCombinations(attributes, 0);
      return allSkus;
    };

    // Generate all combinations and replace the SKUs array with them
    const allSkus = generateAllCombinations(skuAttributes);
    replaceSkus(allSkus);

    toast.success('SKUs generated successfully');
  };

  // Use the React Query hook for generating SKUs
  const generateSkusMutation = useGenerateSkusFromGearment();

  const handleImportFromGearment = async () => {
    if (!selectedGearmentType) {
      toast.error('Please select a product type');
      return;
    }

    setIsGeneratingSkus(true);

    try {
      // Use the mutation to generate SKUs
      const response = await generateSkusMutation.mutateAsync(selectedGearmentType);

      // Clear existing SKUs and update local attributes
      replaceSkus([]);

      // Update local attributes state
      const newAttributes = response.attributes.map((attr, index) => ({
        id: `attr-${Date.now()}-${index}`,
        name: attr.name,
        valueNames: attr.valueNames,
      }));

      setSkuAttributes(newAttributes);

      // Format SKUs for replacement
      const newSkus = response.skus.map(sku => ({
        salesAttributes: sku.salesAttributes,
        inventory: {
          quantity: 100,
        },
        price: {
          currency: 'USD',
        },
      } as unknown as FieldArray<T, ArrayPath<T>>));

      // Replace with the new data all at once
      replaceSkus(newSkus);

      toast.success('SKUs imported successfully from Gearment');
    } catch (error: any) {
      // Error handling is already done in the mutation hook
      // No need to show another toast here
    } finally {
      setIsGeneratingSkus(false);
    }
  };

  const handleApplyBulkActions = () => {
    if (selectedSkus.length === 0) {
      toast.error('Please select at least one SKU');
      return;
    }

    selectedSkus.forEach(index => {
      // Need to cast to any to work around TypeScript limitations with dynamic form values
      const sku = form.getValues(
        getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}`)
      ) as any;

      // Apply price if provided
      if (bulkPrice && !isNaN(parseFloat(bulkPrice))) {
        sku.price.amount = parseFloat(bulkPrice);
      }

      // Apply quantity if provided
      if (bulkQuantity && !isNaN(parseInt(bulkQuantity))) {
        if (!sku.inventory || !Array.isArray(sku.inventory)) {
          sku.inventory = [{ quantity: 0 }];
        }
        if (sku.inventory.length === 0) {
          sku.inventory.push({ quantity: 0 });
        }
        sku.inventory[0].quantity = parseInt(bulkQuantity);
      }

      // Apply image to first salesAttribute only if provided
      if (bulkImage && sku.salesAttributes && sku.salesAttributes.length > 0) {
        sku.salesAttributes[0] = {
          ...sku.salesAttributes[0],
          skuImg: bulkImage
        };
      }

      updateSku(index, sku as unknown as FieldArray<T, ArrayPath<T>>);
    });

    toast.success('Bulk actions applied successfully');
    setBulkPrice('');
    setBulkQuantity('');
    setBulkImage(undefined);
  };

  const toggleSkuSelection = (index: number) => {
    setSelectedSkus(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filterSkusByAttributes = () => {
    setSelectedSkus([]);

    skuFields.forEach((_, index) => {
      // Need to cast to any to work around TypeScript limitations with dynamic form values
      const skuData = form.getValues(
        getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}`)
      ) as any;

      let matchesColor = true;
      let matchesSize = true;

      if (selectedColor && selectedColor !== "all") {
        matchesColor = skuData.salesAttributes.some(
          (attr: { name: string; valueName: string }) =>
            attr.name.toLowerCase() === 'color' && attr.valueName === selectedColor
        );
      }

      if (selectedSize && selectedSize !== "all") {
        matchesSize = skuData.salesAttributes.some(
          (attr: { name: string; valueName: string }) =>
            attr.name.toLowerCase() === 'size' && attr.valueName === selectedSize
        );
      }

      if (matchesColor && matchesSize) {
        setSelectedSkus(prev => [...prev, index]);
      }
    });
  };

  return (
    <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import from Gearment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Import from Gearment</h3>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="gearmentType">Product Type</Label>
              <Select value={selectedGearmentType} onValueChange={setSelectedGearmentType}>
                <SelectTrigger id="gearmentType">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLASSIC T-SHIRT">Gildan 5000 - Heavy Cotton T-Shirt</SelectItem>
                  <SelectItem value="DYED HEAVYWEIGHT">Comfort Colors 1717 - Dyed Heavyweight T-Shirt</SelectItem>
                  <SelectItem value="HOODIE">Gildan 18500 - Heavy Blend Hoodie</SelectItem>
                  <SelectItem value="SWEATSHIRT">Gildan 18000 - Heavy Blend Crewneck Sweatshirt</SelectItem>
                  <SelectItem value="AUTHENTIC SHORT">Hanes 5250 - Unisex Authentic T-Shirt</SelectItem>
                  <SelectItem value="JERSEY T-SHIRT">Bella Canvas 3001 - Unisex Jersey T-Shirt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleImportFromGearment}
              disabled={isGeneratingSkus || !selectedGearmentType}
            >
              {isGeneratingSkus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Attributes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Attributes</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAttribute}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </div>

          {skuAttributes.length === 0 ? (
            <div className="flex items-center justify-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No attributes have been added yet. Add attributes to define your product variants.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skuAttributes.map((attribute, index) => (
                <div key={attribute.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`attribute-${index}-name`}>Attribute Name</Label>
                      <Input
                        id={`attribute-${index}-name`}
                        value={attribute.name}
                        onChange={(e) => handleUpdateAttributeName(index, e.target.value)}
                        placeholder="e.g., Color, Size"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAttribute(index)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Attribute Values</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attribute.valueNames.map((value: string, valueIndex: number) => (
                        <Badge key={valueIndex} variant="secondary" className="flex items-center gap-1">
                          {value}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => handleRemoveAttributeValue(index, valueIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        id={`attribute-${index}-newValue`}
                        placeholder="Add new value"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (input.value.trim()) {
                              handleAddAttributeValue(index, input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`attribute-${index}-newValue`) as HTMLInputElement;
                          if (input.value.trim()) {
                            handleAddAttributeValue(index, input.value.trim());
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleGenerateSkus}
              disabled={skuAttributes.length === 0}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate SKUs
            </Button>
          </div>
        </div>

        <Separator />

        {/* SKUs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SKUs</h3>

          {skuFields.length === 0 ? (
            <div className="flex items-center justify-center p-8 border rounded-lg">
              {placeholder}
            </div>
          ) : (
            <>
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Bulk Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="filterColor">Filter by Color</Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger id="filterColor">
                        <SelectValue placeholder="All Colors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        {availableColors.map((color, index) => (
                          <SelectItem key={index} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="filterSize">Filter by Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger id="filterSize">
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        {availableSizes.map((size, index) => (
                          <SelectItem key={index} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={filterSkusByAttributes}>
                      Apply Filter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="bulkPrice">Set Price (USD)</Label>
                      <Input
                        id="bulkPrice"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="e.g., 19.99"
                        value={bulkPrice}
                        onChange={(e) => setBulkPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bulkQuantity">Set Quantity</Label>
                      <Input
                        id="bulkQuantity"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g., 100"
                        value={bulkQuantity}
                        onChange={(e) => setBulkQuantity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Set Image</Label>
                    <SkuImageUploader
                      image={bulkImage}
                      onChange={setBulkImage}
                      size="md"
                      folder={uploadFolder}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleApplyBulkActions}
                      disabled={selectedSkus.length === 0}
                    >
                      Apply to Selected
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) => setSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead>Attributes</TableHead>
                      <TableHead>
                        {(() => {
                          // Get first attribute name from available SKUs for column header
                          const skus = form.getValues(getTypeSafePath<T>(`${fieldMappings.skus as string}`)) as any[] || [];
                          const firstAttrName = skus.find(sku => sku?.salesAttributes?.[0]?.name)?.salesAttributes?.[0]?.name;
                          return firstAttrName ? `${firstAttrName.charAt(0).toUpperCase() + firstAttrName.slice(1)} Images` : 'Images';
                        })()}
                      </TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skuFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSkus.includes(index)}
                            onCheckedChange={() => toggleSkuSelection(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(form.getValues(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}.salesAttributes`)) || [])
                              .map((attr: any, attrIndex: number) => (
                                <Badge key={attrIndex} variant="outline">
                                  {attr.name}: {attr.valueName}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const salesAttributes = form.getValues(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}.salesAttributes`)) as any[] || [];
                            const firstAttr = salesAttributes[0] as any;

                            if (!firstAttr) return null;

                            return (
                              <SkuImageUploader
                                image={firstAttr.skuImg}
                                onChange={(image: SkuImage | undefined) => {
                                  const skuData = form.getValues(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}`)) as any;
                                  const updatedSalesAttributes = [...skuData.salesAttributes];
                                  updatedSalesAttributes[0] = {
                                    ...updatedSalesAttributes[0],
                                    skuImg: image
                                  };
                                  const updatedSku = {
                                    ...skuData,
                                    salesAttributes: updatedSalesAttributes
                                  };
                                  updateSku(index, updatedSku as unknown as FieldArray<T, ArrayPath<T>>);
                                }}
                                size="sm"
                                folder={uploadFolder}
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              className="w-20"
                              {...form.register(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}.price.amount`), {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            className="w-20"
                            {...form.register(getTypeSafePath<T>(`${fieldMappings.skus as string}.${index}.inventory.0.quantity`), {
                              valueAsNumber: true,
                            })}
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSku(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          type="button"
        >
          Back: Images
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            // Find the form and submit it
            const productForm = document.getElementById('product-form') as HTMLFormElement;
            if (productForm) {
              // Create a submit event with bubbles and cancelable set to true
              const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
              });

              // Dispatch the event
              productForm.dispatchEvent(submitEvent);
            } else {
              // Fallback: Find and click the submit button
              const mainSubmitButton = document.querySelector('form > div > button[type="submit"]');
              if (mainSubmitButton) {
                (mainSubmitButton as HTMLButtonElement).click();
              }
            }
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingButtonText}
            </>
          ) : (
            submitButtonText || (isEditing ? 'Update' : 'Create')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
