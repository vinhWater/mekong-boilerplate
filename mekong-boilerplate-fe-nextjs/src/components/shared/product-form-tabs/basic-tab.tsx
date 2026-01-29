'use client';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseFormContextType, getTypeSafePath } from '@/components/shared/base-product-form';

export interface BasicTabProps<T extends FieldValues> {
  context: BaseFormContextType<T>;
  titleLabel?: string;
  descriptionLabel?: string;
  showPublicSwitch?: boolean;
  publicSwitchLabel?: string;
  publicSwitchDescription?: string;
  cancelPath: string;
  nextTabId?: string;
  onNext?: () => void;
}

export function BasicTab<T extends FieldValues>({
  context,
  titleLabel = 'Product Title',
  descriptionLabel = 'Product Description',
  showPublicSwitch = false,
  publicSwitchLabel = 'Public Template',
  publicSwitchDescription = 'Make this template available to all users',
  cancelPath,
  nextTabId = 'category',
  onNext,
}: BasicTabProps<T>) {
  const { form, navigateToTab, fieldMappings } = context;

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    navigateToTab(nextTabId);
  };

  return (
    <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPublicSwitch && (
          <FormField
            control={form.control}
            name={getTypeSafePath<T>("isPublic")}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {publicSwitchLabel}
                  </FormLabel>
                  <FormDescription>
                    {publicSwitchDescription}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={getTypeSafePath<T>(fieldMappings.title)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{titleLabel}</FormLabel>
              <FormControl>
                <Input placeholder={`Enter ${titleLabel.toLowerCase()}`} {...field} />
              </FormControl>
              <FormDescription>
                The title of your product as it will appear on TikTok Shop.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getTypeSafePath<T>(fieldMappings.description)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Enter ${descriptionLabel.toLowerCase()}`}
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed description of your product. This will be displayed on the product page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Package Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageDimensions.length)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageDimensions.width)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageDimensions.height)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageDimensions.unit)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CENTIMETER">Centimeter</SelectItem>
                            <SelectItem value="INCH">Inch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Package Weight</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageWeight.value)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onBlur={(e) => {
                              // Format to 2 decimal places on blur
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                field.onChange(parseFloat(value.toFixed(2)));
                              }
                              // Call the original onBlur if it exists
                              if (field.onBlur) {
                                field.onBlur();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={getTypeSafePath<T>(fieldMappings.packageWeight.unit)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="KILOGRAM">Kilogram</SelectItem>
                            <SelectItem value="POUND">Pound</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.location.href = cancelPath}
          type="button"
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Category
        </Button>
      </CardFooter>
    </Card>
  );
}
