'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  useTeamMembers,
  useSendInvitationEmail,
  useRemoveMember,
  useAssignStore,
  useAssignableStores,
  usePendingInvitations,
  useResendInvitation,
  useCancelInvitation,
  useUnassignStore,
} from '@/lib/hooks';
import { Member } from '@/lib/api/services/team-service';
import {
  Users,
  UserPlus,
  Trash2,
  Store,
  RefreshCw,
  Mail,
  Clock,
  Send,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeamManagementPage() {
  // State for dialogs
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAssignStoreDialogOpen, setIsAssignStoreDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // State for forms
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  // State for expandable rows - default to all expanded
  const [expandedMembers, setExpandedMembers] = useState<Set<number>>(() =>
    new Set()
  );

  // State for unassigning store
  const [unassigningStoreId, setUnassigningStoreId] = useState<number | null>(null);

  // Fetch data
  const {
    data: members,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useTeamMembers();
  const { data: assignableStores, isLoading: isLoadingStores } =
    useAssignableStores();
  const {
    data: pendingInvitations,
  } = usePendingInvitations();

  // Mutations
  const sendInvitationMutation = useSendInvitationEmail();
  const removeMemberMutation = useRemoveMember();
  const assignStoreMutation = useAssignStore();
  const resendInvitationMutation = useResendInvitation();
  const cancelInvitationMutation = useCancelInvitation();
  const unassignStoreMutation = useUnassignStore();

  // Update expanded members when members data changes - default to all expanded
  React.useEffect(() => {
    if (members && members.length > 0) {
      setExpandedMembers(new Set(members.map((member) => member.id)));
    }
  }, [members]);

  // Handle invite member
  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast.error('Email is required');
      return;
    }

    await sendInvitationMutation.mutateAsync(inviteEmail);

    // Reset form and close dialog
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  // Handle remove member
  const handleRemoveMember = async (member: Member) => {
    if (!confirm(`Are you sure you want to remove ${member.email} from your team?`)) {
      return;
    }

    await removeMemberMutation.mutateAsync(member.id);
  };

  // Handle assign store
  const handleAssignStore = async () => {
    if (!selectedMember || !selectedStoreId) {
      toast.error('Please select a store');
      return;
    }

    await assignStoreMutation.mutateAsync({
      storeId: parseInt(selectedStoreId),
      memberId: selectedMember.id,
    });

    // Reset and close dialog
    setSelectedStoreId('');
    setSelectedMember(null);
    setIsAssignStoreDialogOpen(false);
  };

  // Open assign store dialog
  const openAssignStoreDialog = (member: Member) => {
    setSelectedMember(member);
    setIsAssignStoreDialogOpen(true);
  };

  // Toggle member row expansion
  const toggleMemberExpansion = (memberId: number) => {
    setExpandedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  // Handle unassign store
  const handleUnassignStore = async (storeId: number) => {
    if (!confirm('Are you sure you want to unassign this store?')) {
      return;
    }

    setUnassigningStoreId(storeId);
    try {
      await unassignStoreMutation.mutateAsync(storeId);
      toast.success('Store unassigned successfully');
      // Refetch members to update the list
      await refetchMembers();
    } catch (error) {
      toast.error('Failed to unassign store');
    } finally {
      setUnassigningStoreId(null);
    }
  };

  // Handle resend invitation
  const handleResendInvitation = async (email: string) => {
    await resendInvitationMutation.mutateAsync(email);
  };

  // Handle cancel invitation
  const handleCancelInvitation = async (email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      return;
    }
    await cancelInvitationMutation.mutateAsync(email);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and assign stores
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMembers()}
            disabled={isLoadingMembers}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingMembers ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Pending Invitations Card */}
      {pendingInvitations && pendingInvitations.length > 0 && (
        <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.email}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(invitation.expiresAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.email)}
                          disabled={resendInvitationMutation.isPending}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Resend
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.email)}
                          disabled={cancelInvitationMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Team Members Card */}
      <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMembers ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading members...
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet. Invite your first member to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <React.Fragment key={member.id}>
                    {/* Main Member Row */}
                    <TableRow
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleMemberExpansion(member.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 pointer-events-none"
                        >
                          {expandedMembers.has(member.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{member.email}</TableCell>
                      <TableCell>{member.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(member.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAssignStoreDialog(member)}
                          >
                            <Store className="mr-2 h-4 w-4" />
                            Assign Store
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(member)}
                            disabled={removeMemberMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Assigned Stores Row */}
                    {expandedMembers.has(member.id) && member.assignedStores && member.assignedStores.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-muted/20 border-l-4 border-primary">
                            <div className="space-y-0">
                              {member.assignedStores.map((store, index) => (
                                <div
                                  key={store.id || index}
                                  className="flex items-center justify-between p-3 ml-8 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                  style={{ backgroundColor: 'var(--seller-card-bg)' }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium truncate" title={store.friendly_name}>
                                        {store.friendly_name}
                                      </span>
                                      <span className="text-xs text-muted-foreground truncate" title={store.code}>
                                        {store.code}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 text-right min-w-0 w-32 mr-4">
                                    <div className="text-xs text-muted-foreground">Assigned</div>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(store.assignedAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUnassignStore(store.id)}
                                    disabled={unassigningStoreId === store.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member. They will receive an email with instructions to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteMember}
              disabled={sendInvitationMutation.isPending || !inviteEmail}
            >
              {sendInvitationMutation.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Store Dialog */}
      <Dialog open={isAssignStoreDialogOpen} onOpenChange={setIsAssignStoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Store to {selectedMember?.email}</DialogTitle>
            <DialogDescription>
              Select a store to assign to this team member. They will have access to manage this store.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="store">Select Store</Label>
              {isLoadingStores ? (
                <div className="text-sm text-muted-foreground">Loading stores...</div>
              ) : !assignableStores || assignableStores.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No stores available for assignment. All stores are already assigned.
                </div>
              ) : (
                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableStores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.friendly_name} ({store.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignStoreDialogOpen(false);
                setSelectedStoreId('');
                setSelectedMember(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignStore}
              disabled={assignStoreMutation.isPending || !selectedStoreId}
            >
              {assignStoreMutation.isPending ? 'Assigning...' : 'Assign Store'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

