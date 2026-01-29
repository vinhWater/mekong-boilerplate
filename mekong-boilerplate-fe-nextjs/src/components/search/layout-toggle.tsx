'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, Table } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LayoutType = 'table' | 'thumbnail';

interface LayoutToggleProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  className?: string;
}

export function LayoutToggle({
  currentLayout,
  onLayoutChange,
  className
}: LayoutToggleProps) {
  return (
    <div className={cn("flex items-center border rounded-lg p-1", className)}>
      <Button
        variant={currentLayout === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLayoutChange('table')}
        className={cn(
          "h-8 px-2 sm:px-3 rounded-md transition-all",
          currentLayout === 'table'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted"
        )}
        aria-label="Table view"
      >
        <Table className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Table</span>
      </Button>
      <Button
        variant={currentLayout === 'thumbnail' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLayoutChange('thumbnail')}
        className={cn(
          "h-8 px-2 sm:px-3 rounded-md transition-all",
          currentLayout === 'thumbnail'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted"
        )}
        aria-label="Thumbnail view"
      >
        <LayoutGrid className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Thumbnail</span>
      </Button>
    </div>
  );
}
