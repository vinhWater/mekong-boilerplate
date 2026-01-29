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
import { UserFilters as UserFiltersType } from '@/types/user-filters';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: Partial<UserFiltersType>) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function UserFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  isOpen,
  onToggle,
}: UserFiltersProps) {
  const [localFilters, setLocalFilters] = useState<UserFiltersType>(filters);

  // Handle local filter changes
  const handleLocalFilterChange = (key: keyof UserFiltersType, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
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
    onResetFilters();
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'page' || key === 'limit' || key === 'sortField' || key === 'sortDirection') {
      return false;
    }
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Search by email..."
                  value={localFilters.email || ''}
                  onChange={(e) => handleLocalFilterChange('email', e.target.value)}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Search by name..."
                  value={localFilters.name || ''}
                  onChange={(e) => handleLocalFilterChange('name', e.target.value)}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={localFilters.role || 'all'}
                  onValueChange={(value) => handleLocalFilterChange('role', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Created Date From */}
              <div className="space-y-2">
                <Label htmlFor="createdDateFrom">Created From</Label>
                <Input
                  id="createdDateFrom"
                  type="date"
                  value={localFilters.createdDateFrom || ''}
                  onChange={(e) => handleLocalFilterChange('createdDateFrom', e.target.value)}
                />
              </div>

              {/* Created Date To */}
              <div className="space-y-2">
                <Label htmlFor="createdDateTo">Created To</Label>
                <Input
                  id="createdDateTo"
                  type="date"
                  value={localFilters.createdDateTo || ''}
                  onChange={(e) => handleLocalFilterChange('createdDateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
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
