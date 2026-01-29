'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { UsersTable } from '@/components/admin/users/users-table';
import { UserFilters } from '@/components/admin/users/user-filters';
import { AddBonusDialog } from '@/components/admin/users/add-bonus-dialog';
import { useUsers, User } from '@/lib/hooks/use-users-query';
import { useUsersStore } from '@/lib/store/users-store';
import {
  Download,
  ChevronsLeft,
  ChevronsRight,
  UserPlus,
} from 'lucide-react';

export default function UsersPage() {

  // Use Zustand store for persistent state
  const {
    filters,
    setFilters,
    resetFilters,
    selectedUserIds,
    toggleSelectAll,
    addSelectedUserId,
    removeSelectedUserId,

    isFiltersPanelOpen,
    setFiltersPanelOpen,
    isBonusDialogOpen,
    setIsBonusDialogOpen,
    bonusDialogUserId,
    setBonusDialogUserId,
  } = useUsersStore();

  // Fetch users with filters
  const {
    data: usersData,
    isLoading: isLoadingUsers,
  } = useUsers(filters);

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sortField, sortDirection] = value.split('-');
    setFilters({
      sortField,
      sortDirection: sortDirection as 'asc' | 'desc',
      page: 1, // Reset to first page on sort change
    });
  };

  // Handle table sorting
  const handleTableSort = (field: string) => {
    const newDirection =
      filters.sortField === field && filters.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    setFilters({
      sortField: field,
      sortDirection: newDirection,
      page: 1,
    });
  };

  // Handle select all users
  const handleSelectAll = (selected: boolean) => {
    const allUserIds = usersData?.data.map((user: User) => user.id) || [];
    toggleSelectAll(allUserIds, selected);
  };

  // Handle select single user
  const handleSelectUser = (userId: number, selected: boolean) => {
    if (selected) {
      addSelectedUserId(userId);
    } else {
      removeSelectedUserId(userId);
    }
  };

  // Handle view user details
  const handleViewDetails = (user: User) => {
    // For now, just log - could navigate to user detail page
    console.log('View user details:', user);
  };

  // Handle add bonus
  const handleAddBonus = (user: User) => {
    setBonusDialogUserId(user.id);
    setIsBonusDialogOpen(true);
  };

  // Handle export users
  const handleExportUsers = () => {
    // TODO: Implement export functionality
    console.log('Export users with filters:', filters);
  };

  const selectedUser = usersData?.data.find(user => user.id === bonusDialogUserId) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportUsers}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Select
            value={`${filters.sortField || 'createdAt'}-${filters.sortDirection || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest first</SelectItem>
              <SelectItem value="createdAt-asc">Oldest first</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="email-asc">Email A-Z</SelectItem>
              <SelectItem value="role-asc">Role A-Z</SelectItem>
              <SelectItem value="balance-desc">Balance High-Low</SelectItem>
              <SelectItem value="balance-asc">Balance Low-High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        isOpen={isFiltersPanelOpen}
        onToggle={() => setFiltersPanelOpen(!isFiltersPanelOpen)}
      />

      {/* Bulk Actions */}
      {selectedUserIds.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExportUsers}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Selected ({selectedUserIds.length})
          </Button>
        </div>
      )}

      {/* Users Table */}
      <UsersTable
        users={usersData?.data || []}
        isLoading={isLoadingUsers}
        selectedUserIds={selectedUserIds}
        onSelectAll={handleSelectAll}
        onSelectUser={handleSelectUser}
        onViewDetails={handleViewDetails}
        onAddBonus={handleAddBonus}
        onSort={handleTableSort}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
      />

      {/* Pagination */}
      {usersData && usersData.meta.totalItems > 0 && (
        <Card className="pt-0">
          <CardFooter className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <Select
                value={filters.limit?.toString() || "20"}
                onValueChange={(value) => setFilters({ limit: parseInt(value), page: 1 })}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Showing {usersData.data.length} of {usersData.meta.totalItems} users
              </span>
            </div>

            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setFilters({ page: 1 })}
                    disabled={(filters.page || 1) <= 1 || isLoadingUsers}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Go to first page</span>
                  </Button>
                </PaginationItem>

                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => (filters.page || 1) > 1 ? setFilters({ page: Math.max(1, (filters.page || 1) - 1) }) : undefined}
                    disabled={(filters.page || 1) <= 1 || isLoadingUsers}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="sr-only">Go to previous page</span>
                  </Button>
                </PaginationItem>

                {/* Current page indicator */}
                <PaginationItem>
                  <span className="px-4 py-2">
                    Page {filters.page || 1} of {usersData.meta.totalPages || 1}
                  </span>
                </PaginationItem>

                {/* Next page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => (filters.page || 1) < (usersData.meta.totalPages || 1) ? setFilters({ page: (filters.page || 1) + 1 }) : undefined}
                    disabled={(filters.page || 1) >= (usersData.meta.totalPages || 1) || isLoadingUsers}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="sr-only">Go to next page</span>
                  </Button>
                </PaginationItem>

                {/* Last page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setFilters({ page: usersData.meta.totalPages || 1 })}
                    disabled={(filters.page || 1) >= (usersData.meta.totalPages || 1) || isLoadingUsers}
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Go to last page</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      )}

      {/* Add Bonus Dialog */}
      <AddBonusDialog
        user={selectedUser}
        open={isBonusDialogOpen}
        onOpenChange={(open) => {
          setIsBonusDialogOpen(open);
          if (!open) {
            setBonusDialogUserId(null);
          }
        }}
      />
    </div>
  );
}
