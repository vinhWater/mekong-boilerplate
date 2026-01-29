'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, DollarSign } from 'lucide-react';
import { useCreateBonusTransaction, User } from '@/lib/hooks/use-users-query';
import { useUserBalance } from '@/lib/hooks/use-transactions-query';

interface AddBonusDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [5, 10, 20, 50];

export function AddBonusDialog({ user, open, onOpenChange }: AddBonusDialogProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

  const createBonusTransaction = useCreateBonusTransaction();
  
  // Get user balance - we'll need to modify this to get balance for specific user
  const { data: balanceData, isLoading: isLoadingBalance } = useUserBalance();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setAmount('');
      setCustomAmount('');
      setDescription('');
      setSelectedQuickAmount(null);
    }
  }, [open]);

  const handleQuickAmountSelect = (quickAmount: number) => {
    setSelectedQuickAmount(quickAmount);
    setAmount(quickAmount);
    setCustomAmount(quickAmount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedQuickAmount(null);
    const numValue = parseFloat(value);
    setAmount(isNaN(numValue) ? '' : numValue);
  };

  const handleSubmit = async () => {
    if (!user || !amount || amount <= 0) return;

    try {
      await createBonusTransaction.mutateAsync({
        userId: user.id,
        amount: Number(amount),
        description: description || `Admin bonus for ${user.name}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const currentBalance = Number(user?.balance || 0);
  const newBalance = currentBalance + (Number(amount) || 0);

  const isValid = amount && Number(amount) > 0 && user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Bonus Transaction
          </DialogTitle>
          <DialogDescription>
            Create a bonus transaction for {user?.name} ({user?.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Amount</Label>
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={selectedQuickAmount === quickAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmountSelect(quickAmount)}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="customAmount" className="text-sm text-muted-foreground">
                Custom Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customAmount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-10"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this bonus transaction..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Balance Display */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Balance:</span>
                  <Badge variant="secondary">${currentBalance.toFixed(2)}</Badge>
                </div>
                {amount && Number(amount) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">New Balance:</span>
                    <Badge variant="default">${newBalance.toFixed(2)}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createBonusTransaction.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || createBonusTransaction.isPending}
          >
            {createBonusTransaction.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Bonus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
