'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { CrawledProductFilters } from '@/types/crawled-product';

interface SearchFiltersProps {
  filters: CrawledProductFilters;
  onFiltersChange: (filters: Partial<CrawledProductFilters>) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  isOpen,
  onToggle
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CrawledProductFilters>(filters);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = (key: keyof CrawledProductFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange({ ...localFilters, page: 1 }); // Reset to first page
  };

  return (
    <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">Filters</CardTitle>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Search by title */}
            <div className="space-y-2">
              <Label htmlFor="title-filter">Product Title</Label>
              <div className="flex gap-2">
                <Input
                  id="title-filter"
                  placeholder="Search by product title..."
                  value={localFilters.title || ''}
                  onChange={(e) => handleLocalFilterChange('title', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>
            </div>

            {/* Marketplace filter */}
            <div className="space-y-2">
              <Label>Marketplace</Label>
              <div className="flex gap-2">
                <Select
                  value={localFilters.marketplace || ''}
                  onValueChange={(value) => {
                    const newValue = value === 'all' ? undefined : value as 'etsy' | 'ebay' | 'amazon';
                    handleLocalFilterChange('marketplace', newValue);
                    onFiltersChange({ marketplace: newValue, page: 1 });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All marketplaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All marketplaces</SelectItem>
                    <SelectItem value="etsy">Etsy</SelectItem>
                    <SelectItem value="ebay">eBay</SelectItem>
                    <SelectItem value="amazon">Amazon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seller name filter */}
            <div className="space-y-2">
              <Label htmlFor="seller-filter">Seller Name</Label>
              <div className="flex gap-2">
                <Input
                  id="seller-filter"
                  placeholder="Search by seller name..."
                  value={localFilters.sellerName || ''}
                  onChange={(e) => handleLocalFilterChange('sellerName', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>
            </div>

            {/* Review range filter */}
            <div className="space-y-2">
              <Label>Review Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min reviews"
                  type="number"
                  value={localFilters.minReviewCount || ''}
                  onChange={(e) => handleLocalFilterChange('minReviewCount', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  placeholder="Max reviews"
                  type="number"
                  value={localFilters.maxReviewCount || ''}
                  onChange={(e) => handleLocalFilterChange('maxReviewCount', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Date range filter */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={localFilters.extractedAfter || ''}
                  onChange={(e) => handleLocalFilterChange('extractedAfter', e.target.value)}
                />
                <Input
                  type="date"
                  value={localFilters.extractedBefore || ''}
                  onChange={(e) => handleLocalFilterChange('extractedBefore', e.target.value)}
                />
              </div>
            </div>

            {/* Public filter */}
            <div className="space-y-2">
              <Label>Public</Label>
              <div className="flex gap-2">
                <Select
                  value={localFilters.isPublic ? 'yes' : 'no'}
                  onValueChange={(value) => {
                    const newValue = value === 'yes';
                    handleLocalFilterChange('isPublic', newValue);
                    onFiltersChange({ isPublic: newValue, page: 1 });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Public products only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={onResetFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
