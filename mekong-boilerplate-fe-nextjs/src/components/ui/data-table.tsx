'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  pagination?: {
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  renderBulkActions?: (selectedRows: TData[]) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = 'Search...',
  pagination,
  onRowSelectionChange,
  renderBulkActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: (updatedRowSelection) => {
      const newSelection = typeof updatedRowSelection === 'function'
        ? updatedRowSelection(rowSelection)
        : updatedRowSelection;
      setRowSelection(newSelection);
      if (onRowSelectionChange) {
        onRowSelectionChange(newSelection);
      }
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      ...(pagination && { pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize } }),
    },
    ...(pagination && { manualPagination: true, pageCount: pagination.pageCount }),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  return (
    <div className="space-y-4">
      {searchColumn && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          {selectedRows.length > 0 && renderBulkActions && (
            <div className="flex items-center gap-2">
              {renderBulkActions(selectedRows)}
            </div>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {pagination ? (
          <Pagination>
            <div className="flex items-center justify-between space-x-6 lg:space-x-8">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pagination.pageIndex + 1} of{' '}
                {pagination.pageCount}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(0)}
                  disabled={pagination.pageIndex === 0}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                  disabled={pagination.pageIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                  disabled={pagination.pageIndex === pagination.pageCount - 1}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageCount - 1)}
                  disabled={pagination.pageIndex === pagination.pageCount - 1}
                >
                  Last
                </Button>
              </div>
            </div>
          </Pagination>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
