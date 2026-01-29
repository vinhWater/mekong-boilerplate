'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { User } from '@/lib/hooks/use-users-query';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  selectedUserIds: number[];
  onSelectAll: (selected: boolean) => void;
  onSelectUser: (userId: number, selected: boolean) => void;
  onViewDetails: (user: User) => void;
  onAddBonus: (user: User) => void;
  onSort: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export function UsersTable({
  users,
  isLoading,
  selectedUserIds,
  onSelectAll,
  onSelectUser,
  onViewDetails,
  onAddBonus,
  onSort,
  sortField,
  sortDirection,
}: UsersTableProps) {

  // Custom time formatting function
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'secondary';
      case 'member':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${
          sortDirection === 'asc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  const allSelected = users.length > 0 && selectedUserIds.length === users.length;
  const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all users"
              />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                User
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('email')}
            >
              <div className="flex items-center">
                Email
                {getSortIcon('email')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('role')}
            >
              <div className="flex items-center">
                Role
                {getSortIcon('role')}
              </div>
            </TableHead>
            <TableHead>Balance</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center">
                Created
                {getSortIcon('createdAt')}
              </div>
            </TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);

            return (
              <TableRow
                key={user.id}
                className={`${isSelected ? 'bg-muted/50' : ''} hover:bg-muted/30 cursor-pointer`}
                onClick={(e) => {
                  // Don't trigger row click if clicking on checkbox, dropdown, or buttons
                  const target = e.target as HTMLElement;
                  if (
                    target.closest('input[type="checkbox"]') ||
                    target.closest('[role="button"]') ||
                    target.closest('button')
                  ) {
                    return;
                  }
                  onViewDetails(user);
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                    aria-label={`Select user ${user.name || user.email}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name || user.email} />
                      <AvatarFallback>
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={user.email}>
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{Number(user.balance || 0).toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatTimeAgo(user.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddBonus(user)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Add Bonus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
