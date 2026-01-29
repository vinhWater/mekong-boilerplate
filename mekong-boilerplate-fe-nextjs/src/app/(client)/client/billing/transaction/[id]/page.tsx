'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/lib/hooks';
import { ArrowLeft, RefreshCw, Calendar, CreditCard, Hash, FileText } from 'lucide-react';

interface TransactionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const transactionId = parseInt(resolvedParams.id);

  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useTransaction(transactionId);

  // Format currency
  const formatCurrency = (amount: string | null) => {
    if (amount === null) return 'N/A';
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
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
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
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
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading transaction details...</span>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive">Transaction not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                The transaction you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCredit = parseFloat(transaction.amount) > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <p className="text-sm text-muted-foreground">
              Transaction ID: {transaction.id}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transaction Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge className={getTypeBadgeColor(transaction.type)}>
                {formatTransactionType(transaction.type)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusBadgeColor(transaction.status)}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className={`text-lg font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {isCredit ? '+' : ''}{formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-sm">{formatPaymentMethod(transaction.paymentMethod)}</p>
            </div>
            {transaction.externalPaymentId && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">External Payment ID</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {transaction.externalPaymentId}
                </p>
              </div>
            )}
            {transaction.referenceId && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Reference ID</p>
                <p className="text-sm font-mono">{transaction.referenceId}</p>
              </div>
            )}
            {transaction.referenceType && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Reference Type</p>
                <p className="text-sm">{transaction.referenceType}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Balance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Balance Before</p>
              <p className="text-sm">{formatCurrency(transaction.balanceBefore)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Transaction Amount</p>
              <p className={`text-sm font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {isCredit ? '+' : ''}{formatCurrency(transaction.amount)}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Balance After</p>
              <p className="text-sm font-semibold">{formatCurrency(transaction.balanceAfter)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transaction.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{transaction.description}</p>
            </div>
          )}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Metadata</p>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created At
              </p>
              <p className="text-sm">{formatDate(transaction.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Updated At
              </p>
              <p className="text-sm">{formatDate(transaction.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
