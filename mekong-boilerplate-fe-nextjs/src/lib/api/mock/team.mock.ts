'use client';

import { 
  Member, 
  InviteMemberDto, 
  AssignStoreDto, 
  AcceptInvitationDto, 
  AssignedStore 
} from '@/lib/api/services/team-service';
import { TikTokShop } from '@/types/shop';

// Mock data storage
let mockMembers: Member[] = [
  {
    id: 1,
    email: 'owner@example.com',
    name: 'Team Owner',
    role: 'owner',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    assignedStoresCount: 2,
    assignedStores: [
      {
        id: 101,
        friendly_name: 'Fashion Store',
        code: 'FS123',
        assignedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
      },
      {
        id: 102,
        friendly_name: 'Electronics Hub',
        code: 'EH456',
        assignedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
      },
    ],
  },
  {
    id: 2,
    email: 'manager@example.com',
    name: 'Store Manager',
    role: 'member',
    createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    assignedStoresCount: 1,
    assignedStores: [
      {
        id: 101,
        friendly_name: 'Fashion Store',
        code: 'FS123',
        assignedAt: new Date('2024-01-15T00:00:00Z').toISOString(),
      },
    ],
  },
];

let mockAssignableStores: TikTokShop[] = [
  {
    id: 101,
    idTT: 'TT101',
    name: 'Fashion Store Official',
    friendly_name: 'Fashion Store',
    region: 'US',
    seller_type: 'cross_border',
    cipher: 'encrypted_cipher',
    code: 'FS123',
    app_key: 'app_key_1',
    auth_code: 'auth_code_1',
    access_token: 'access_token_1',
    access_token_expire_in: '1234567890',
    refresh_token: 'refresh_token_1',
    refresh_token_expire_in: '1234567890',
    last_refreshed_at: new Date().toISOString(),
    createdAt: new Date('2023-12-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2023-12-01T00:00:00Z').toISOString(),
  },
  {
    id: 102,
    idTT: 'TT102',
    name: 'Electronics Hub Official',
    friendly_name: 'Electronics Hub',
    region: 'US',
    seller_type: 'local',
    cipher: 'encrypted_cipher',
    code: 'EH456',
    app_key: 'app_key_2',
    auth_code: 'auth_code_2',
    access_token: 'access_token_2',
    access_token_expire_in: '1234567890',
    refresh_token: 'refresh_token_2',
    refresh_token_expire_in: '1234567890',
    last_refreshed_at: new Date().toISOString(),
    createdAt: new Date('2023-12-02T00:00:00Z').toISOString(),
    updatedAt: new Date('2023-12-02T00:00:00Z').toISOString(),
  },
  {
    id: 103,
    idTT: 'TT103',
    name: 'Home & Garden',
    friendly_name: 'Home & Garden',
    region: 'US',
    seller_type: 'cross_border',
    cipher: 'encrypted_cipher',
    code: 'HG789',
    app_key: 'app_key_3',
    auth_code: 'auth_code_3',
    access_token: 'access_token_3',
    access_token_expire_in: '1234567890',
    refresh_token: 'refresh_token_3',
    refresh_token_expire_in: '1234567890',
    last_refreshed_at: new Date().toISOString(),
    createdAt: new Date('2023-12-03T00:00:00Z').toISOString(),
    updatedAt: new Date('2023-12-03T00:00:00Z').toISOString(),
  },
];

let mockPendingInvitations = [
  {
    email: 'invited@example.com',
    managerEmail: 'owner@example.com',
    storesCount: 0,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
  },
];

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock: Get all team members
 */
export const getMockMembers = async (): Promise<Member[]> => {
  await delay();
  return [...mockMembers];
};

/**
 * Mock: Send invitation email
 */
export const sendMockInvitationEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  await delay();
  
  const existingMember = mockMembers.find(m => m.email === email);
  if (existingMember) {
    throw new Error('User is already a member of the team');
  }

  const existingInvite = mockPendingInvitations.find(i => i.email === email);
  if (existingInvite) {
    throw new Error('Invitation already sent to this email');
  }

  mockPendingInvitations.push({
    email,
    managerEmail: 'owner@example.com',
    storesCount: 0,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  });

  return { success: true, message: 'Invitation sent successfully' };
};

/**
 * Mock: Accept team invitation
 */
export const acceptMockInvitation = async (
  data: AcceptInvitationDto
): Promise<{ success: boolean; message: string; user: Member }> => {
  await delay();
  
  // Create a new member for the accepted invitation
  const newMember: Member = {
    id: mockMembers.length + 1,
    email: 'new-member@example.com', // In a real flow, this would come from the verified token
    name: 'New Member',
    role: 'member',
    createdAt: new Date().toISOString(),
    assignedStoresCount: 0,
    assignedStores: [],
  };

  mockMembers.push(newMember);

  return { 
    success: true, 
    message: 'Invitation accepted successfully',
    user: newMember
  };
};

/**
 * Mock: Remove a member
 */
export const removeMockMember = async (
  memberId: number
): Promise<{ success: boolean; message: string }> => {
  await delay();
  
  const index = mockMembers.findIndex(m => m.id === memberId);
  if (index === -1) {
    throw new Error('Member not found');
  }

  mockMembers.splice(index, 1);
  return { success: true, message: 'Member removed successfully' };
};

/**
 * Mock: Assign store
 */
export const assignMockStore = async (
  data: AssignStoreDto
): Promise<{ success: boolean; message: string; store: TikTokShop }> => {
  await delay();

  const member = mockMembers.find(m => m.id === data.memberId);
  if (!member) {
    throw new Error('Member not found');
  }

  const store = mockAssignableStores.find(s => s.id === data.storeId);
  if (!store) {
    throw new Error('Store not found');
  }

  // Check if store is already assigned
  if (member.assignedStores.some(s => s.id === store.id)) {
    throw new Error('Store already assigned to this member');
  }

  member.assignedStores.push({
    id: store.id,
    friendly_name: store.friendly_name,
    code: store.code,
    assignedAt: new Date().toISOString(),
  });
  member.assignedStoresCount = member.assignedStores.length;

  return { 
    success: true, 
    message: 'Store assigned successfully',
    store 
  };
};

/**
 * Mock: Unassign store
 */
export const unassignMockStore = async (
  storeId: number
): Promise<{ success: boolean; message: string }> => {
  await delay();

  // Find member who has this store assigned
  // Simplified for mock: remove from all members (in reality, context would provide memberId or specific endpoint structure)
  // The service signature only provides storeId, implying the logged-in user or context issues.
  // HOWEVER, the `useUnassignStore` hook usage in `page.tsx` calls it with `storeId` but typically this action is performed ON a member.
  // Reviewing page.tsx: `handleUnassignStore` calls `unassignStoreMutation(storeId)`. 
  // It seems the API endpoint `/team/stores/${storeId}/unassign` handles finding the assignment.
  // In our mock, we need to iterate members to find and remove.
  
  let found = false;
  mockMembers.forEach(member => {
    const storeIndex = member.assignedStores.findIndex(s => s.id === storeId);
    if (storeIndex !== -1) {
      member.assignedStores.splice(storeIndex, 1);
      member.assignedStoresCount = member.assignedStores.length;
      found = true;
    }
  });

  if (!found) {
    // It's possible the store was assigned to the current user, etc.
    // For mock purposes, just succeed.
  }

  return { success: true, message: 'Store unassigned successfully' };
};

/**
 * Mock: Get assignable stores
 */
export const getMockAssignableStores = async (): Promise<TikTokShop[]> => {
  await delay();
  return [...mockAssignableStores];
};

/**
 * Mock: Get pending invitations
 */
export const getMockPendingInvitations = async (): Promise<any[]> => {
  await delay();
  return [...mockPendingInvitations];
};

/**
 * Mock: Resend invitation
 */
export const resendMockInvitation = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  await delay();
  
  const invite = mockPendingInvitations.find(i => i.email === email);
  if (!invite) {
    throw new Error('Invitation not found');
  }

  // Renew expiration
  invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  return { success: true, message: 'Invitation resent successfully' };
};

/**
 * Mock: Cancel invitation
 */
export const cancelMockInvitation = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  await delay();
  
  const index = mockPendingInvitations.findIndex(i => i.email === email);
  if (index === -1) {
    throw new Error('Invitation not found');
  }

  mockPendingInvitations.splice(index, 1);
  
  return { success: true, message: 'Invitation cancelled successfully' };
};
