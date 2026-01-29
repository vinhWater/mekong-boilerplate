import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  getMembers,
  sendInvitationEmail,
  acceptInvitation,
  removeMember,
  assignStore,
  unassignStore,
  getAssignableStores,
  getPendingInvitations,
  resendInvitation,
  cancelInvitation,
  InviteMemberDto,
  AssignStoreDto,
  AcceptInvitationDto,
  Member,
} from '@/lib/api/services/team-service';
import { createQueryKeys } from '@/lib/api/api-client';

// Create query keys for team management
export const teamKeys = {
  all: ['team'] as const,
  members: () => [...teamKeys.all, 'members'] as const,
  pendingInvitations: () => [...teamKeys.all, 'pending-invitations'] as const,
  assignableStores: () => [...teamKeys.all, 'assignable-stores'] as const,
};

/**
 * React Query hooks for Team Management
 */

/**
 * Hook to fetch team members
 */
export function useTeamMembers() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: () => getMembers(session?.backendToken),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to send invitation email
 */
export function useSendInvitationEmail() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      sendInvitationEmail(email, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.pendingInvitations() });
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      toast.success('Invitation email sent successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send invitation');
    },
  });
}

/**
 * Hook to accept team invitation
 */
export function useAcceptInvitation() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: AcceptInvitationDto) => acceptInvitation(data, session?.backendToken),
    onSuccess: () => {
      toast.success('Invitation accepted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to accept invitation');
    },
  });
}

/**
 * Hook to remove a member
 */
export function useRemoveMember() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) =>
      removeMember(memberId, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamKeys.assignableStores() });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to remove member');
    },
  });
}

/**
 * Hook to assign a store to a member
 */
export function useAssignStore() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignStoreDto) =>
      assignStore(data, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamKeys.assignableStores() });
      toast.success('Store assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to assign store');
    },
  });
}

/**
 * Hook to unassign a store from a member
 */
export function useUnassignStore() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: number) =>
      unassignStore(storeId, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamKeys.assignableStores() });
      toast.success('Store unassigned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to unassign store');
    },
  });
}

/**
 * Hook to fetch assignable stores
 */
export function useAssignableStores() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: teamKeys.assignableStores(),
    queryFn: () => getAssignableStores(session?.backendToken),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch pending invitations
 */
export function usePendingInvitations() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: teamKeys.pendingInvitations(),
    queryFn: () => getPendingInvitations(session?.backendToken),
    enabled: isAuthenticated && session?.user?.role === 'manager',
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to resend invitation
 */
export function useResendInvitation() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      resendInvitation(email, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.pendingInvitations() });
      toast.success('Invitation resent successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to resend invitation');
    },
  });
}

/**
 * Hook to cancel invitation
 */
export function useCancelInvitation() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      cancelInvitation(email, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.pendingInvitations() });
      toast.success('Invitation cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to cancel invitation',
      );
    },
  });
}
