'use client';

import { apiRequest } from '@/lib/api/api-client';
import { TikTokShop } from '@/types/shop';
import {
  getMockMembers,
  sendMockInvitationEmail,
  acceptMockInvitation,
  removeMockMember,
  assignMockStore,
  unassignMockStore,
  getMockAssignableStores,
  getMockPendingInvitations,
  resendMockInvitation,
  cancelMockInvitation
} from '@/lib/api/mock/team.mock';

// Check if mock data should be used
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface AssignedStore {
  id: number;
  friendly_name: string;
  code: string;
  assignedAt: string;
}

export interface Member {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  assignedStoresCount: number;
  assignedStores: AssignedStore[];
}

export interface InviteMemberDto {
  email: string;
}

export interface AssignStoreDto {
  storeId: number;
  memberId: number;
}

export interface AcceptInvitationDto {
  token: string;
}

/**
 * Get all team members
 */
export const getMembers = async (token?: string): Promise<Member[]> => {
  if (useMockData) {
    return getMockMembers();
  }
  return apiRequest<Member[]>({
    url: '/team/members',
    method: 'GET',
    token,
  });
};

/**
 * Send invitation email (using magic link)
 */
export const sendInvitationEmail = async (
  email: string,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockData) {
    return sendMockInvitationEmail(email);
  }
  return apiRequest<{ success: boolean; message: string }>({
    url: '/team/members/invite',
    method: 'POST',
    data: { email },
    token,
  });
};

/**
 * Accept team invitation
 */
export const acceptInvitation = async (
  data: AcceptInvitationDto,
  token?: string
): Promise<{ success: boolean; message: string; user: Member }> => {
  if (useMockData) {
    return acceptMockInvitation(data);
  }
  return apiRequest<{ success: boolean; message: string; user: Member }>({
    url: '/team/members/accept-invitation',
    method: 'POST',
    data,
    token,
  });
};

/**
 * Remove a member from the team
 */
export const removeMember = async (
  memberId: number,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockData) {
    return removeMockMember(memberId);
  }
  return apiRequest<{ success: boolean; message: string }>({
    url: `/team/members/${memberId}`,
    method: 'DELETE',
    token,
  });
};

/**
 * Assign a store to a member
 */
export const assignStore = async (
  data: AssignStoreDto,
  token?: string
): Promise<{ success: boolean; message: string; store: TikTokShop }> => {
  if (useMockData) {
    return assignMockStore(data);
  }
  return apiRequest<{ success: boolean; message: string; store: TikTokShop }>({
    url: '/team/stores/assign',
    method: 'POST',
    data,
    token,
  });
};

/**
 * Unassign a store from a member
 */
export const unassignStore = async (
  storeId: number,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockData) {
    return unassignMockStore(storeId);
  }
  return apiRequest<{ success: boolean; message: string }>({
    url: `/team/stores/${storeId}/unassign`,
    method: 'DELETE',
    token,
  });
};

/**
 * Get list of stores that can be assigned
 */
export const getAssignableStores = async (token?: string): Promise<TikTokShop[]> => {
  if (useMockData) {
    return getMockAssignableStores();
  }
  return apiRequest<TikTokShop[]>({
    url: '/team/stores/assignable',
    method: 'GET',
    token,
  });
};

/**
 * Get pending invitations
 */
export const getPendingInvitations = async (
  token?: string
): Promise<
  {
    email: string;
    managerEmail: string;
    storesCount: number;
    expiresAt: string;
    createdAt: string;
  }[]
> => {
  if (useMockData) {
    return getMockPendingInvitations();
  }
  return apiRequest<
    {
      email: string;
      managerEmail: string;
      storesCount: number;
      expiresAt: string;
      createdAt: string;
    }[]
  >({
    url: '/team/invitations/pending',
    method: 'GET',
    token,
  });
};

/**
 * Resend invitation
 */
export const resendInvitation = async (
  email: string,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockData) {
    return resendMockInvitation(email);
  }
  return apiRequest<{ success: boolean; message: string }>({
    url: '/team/invitations/resend',
    method: 'POST',
    data: { email },
    token,
  });
};

/**
 * Cancel invitation
 */
export const cancelInvitation = async (
  email: string,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockData) {
    return cancelMockInvitation(email);
  }
  return apiRequest<{ success: boolean; message: string }>({
    url: '/team/invitations/cancel',
    method: 'DELETE',
    data: { email },
    token,
  });
};
