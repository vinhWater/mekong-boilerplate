'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
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
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, RefreshCw } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails: (transaction: Transaction) => void;
}

// Format currency
const formatCurrency = (amount: string) => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format transaction type
const formatTransactionType = (type: string) => {
  const typeMap: Record<string, string> = {
    top_up: 'Top Up',
    subscription: 'Subscription',
    mockup_image: 'Mockup Image',
    mockup_video: 'Mockup Video',
    refund: 'Refund',
    bonus: 'Bonus',
    adjustment: 'Adjustment',
  };
  return typeMap[type] || type;
};

// Format payment method
const formatPaymentMethod = (method: string) => {
  const methodMap: Record<string, string> = {
    stripe: 'Stripe',
    crypto: 'Crypto',
    vnd_transfer: 'VND Transfer',
    balance: 'Balance',
    admin: 'Admin',
  };
  return methodMap[method] || method;
};

// Get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'canceled':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Get type badge color
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'top_up':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'subscription':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'refund':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'bonus':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export function TransactionsTable({
  transactions,
  isLoading,
  onViewDetails,
}: TransactionsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading transactions...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>External ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isCredit = parseFloat(transaction.amount) > 0;
            
            return (
              <TableRow
                key={transaction.id}
                className="hover:bg-muted/30 cursor-pointer"
                onClick={(e) => {
                  // Don't trigger row click if clicking on dropdown
                  const target = e.target as HTMLElement;
                  if (
                    !target.closest('[data-radix-collection-item]') &&
                    !target.closest('button')
                  ) {
                    onViewDetails(transaction);
                  }
                }}
              >
                <TableCell className="font-medium">
                  {formatDate(transaction.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge className={getTypeBadgeColor(transaction.type)}>
                    {formatTransactionType(transaction.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isCredit ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {formatPaymentMethod(transaction.paymentMethod)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground font-mono">
                    {transaction.externalPaymentId
                      ? transaction.externalPaymentId.length > 20
                        ? `${transaction.externalPaymentId.substring(0, 20)}...`
                        : transaction.externalPaymentId
                      : '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm line-clamp-2">
                    {transaction.description}
                  </span>
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
                      <DropdownMenuItem
                        onClick={() => onViewDetails(transaction)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
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
