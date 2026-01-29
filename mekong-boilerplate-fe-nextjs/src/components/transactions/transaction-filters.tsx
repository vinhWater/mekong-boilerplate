'use client';

import { useState } from 'react';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransactionFilters as TransactionFiltersType } from '@/types/transaction';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: Partial<TransactionFiltersType>) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Quick date filter helpers
const getQuickDateRange = (range: string): { from: number; to: number } | null => {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  switch (range) {
    case 'today':
      return {
        from: Math.floor(startOfDay.getTime() / 1000),
        to: Math.floor(endOfDay.getTime() / 1000),
      };
    case 'last7days': {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() - 7);
      return {
        from: Math.floor(date.getTime() / 1000),
        to: Math.floor(endOfDay.getTime() / 1000),
      };
    }
    case 'last30days': {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() - 30);
      return {
        from: Math.floor(date.getTime() / 1000),
        to: Math.floor(endOfDay.getTime() / 1000),
      };
    }
    case 'last90days': {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() - 90);
      return {
        from: Math.floor(date.getTime() / 1000),
        to: Math.floor(endOfDay.getTime() / 1000),
      };
    }
    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      return {
        from: Math.floor(firstDay.getTime() / 1000),
        to: Math.floor(endOfDay.getTime() / 1000),
      };
    }
    case 'lastMonth': {
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return {
        from: Math.floor(firstDayLastMonth.getTime() / 1000),
        to: Math.floor(lastDayLastMonth.getTime() / 1000),
      };
    }
    default:
      return null;
  }
};

export function TransactionFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  isOpen,
  onToggle,
}: TransactionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TransactionFiltersType>(filters);
  const [selectedQuickRange, setSelectedQuickRange] = useState<string>('all');

  // Handle local filter changes
  const handleLocalFilterChange = (
    key: keyof TransactionFiltersType,
    value: any,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
    // Clear quick range selection if manually changing dates
    if (key === 'createdDateFrom' || key === 'createdDateTo') {
      setSelectedQuickRange('custom');
    }
  };

  // Handle quick date range selection
  const handleQuickDateRange = (range: string) => {
    setSelectedQuickRange(range);
    if (range === 'all') {
      setLocalFilters((prev) => ({
        ...prev,
        createdDateFrom: undefined,
        createdDateTo: undefined,
      }));
    } else {
      const dateRange = getQuickDateRange(range);
      if (dateRange) {
        setLocalFilters((prev) => ({
          ...prev,
          createdDateFrom: dateRange.from,
          createdDateTo: dateRange.to,
        }));
      }
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange({ ...localFilters, page: 1 });
  };

  // Reset filters
  const handleResetFilters = () => {
    setLocalFilters({
      page: 1,
      limit: 20,
      sortField: 'createdAt',
      sortDirection: 'desc',
    });
    setSelectedQuickRange('all');
    onResetFilters();
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (
      key === 'page' ||
      key === 'limit' ||
      key === 'sortField' ||
      key === 'sortDirection'
    ) {
      return false;
    }
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Quick Date Range */}
            <div className="space-y-2">
              <Label>Quick Date Range</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'all' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('all')}
                >
                  All Time
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'today' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('today')}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'last7days' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('last7days')}
                >
                  Last 7 Days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'last30days' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('last30days')}
                >
                  Last 30 Days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'last90days' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('last90days')}
                >
                  Last 90 Days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'thisMonth' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('thisMonth')}
                >
                  This Month
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedQuickRange === 'lastMonth' ? 'default' : 'outline'}
                  onClick={() => handleQuickDateRange('lastMonth')}
                >
                  Last Month
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={localFilters.type || 'all'}
                  onValueChange={(value) =>
                    handleLocalFilterChange('type', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="top_up">Top Up</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="mockup_image">Mockup Image</SelectItem>
                    <SelectItem value="mockup_video">Mockup Video</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={localFilters.status || 'all'}
                  onValueChange={(value) =>
                    handleLocalFilterChange('status', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Filter */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={localFilters.paymentMethod || 'all'}
                  onValueChange={(value) =>
                    handleLocalFilterChange(
                      'paymentMethod',
                      value === 'all' ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="vnd_transfer">VND Transfer</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* External Payment ID */}
              <div className="space-y-2">
                <Label htmlFor="externalPaymentId">External Payment ID</Label>
                <Input
                  id="externalPaymentId"
                  placeholder="Search by payment ID..."
                  value={localFilters.externalPaymentId || ''}
                  onChange={(e) =>
                    handleLocalFilterChange('externalPaymentId', e.target.value)
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
              <Button variant="outline" onClick={handleResetFilters}>
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
