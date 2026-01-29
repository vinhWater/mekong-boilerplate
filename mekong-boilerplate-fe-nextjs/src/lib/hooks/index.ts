// Auth related hooks
import { useNextAuth } from './use-next-auth';
import { useSession } from 'next-auth/react';

// Data fetching hooks (React Query)

import {
  useCrawledProducts,
  useCrawledProduct,
  useCreateCrawledProduct,
  useDeleteCrawledProduct,
  useBulkDeleteCrawledProducts
} from './use-crawled-products-query';
import { useUsers } from './use-users-query';

import {
  useUserBalance,
  useTransactions,
  useTransaction
} from './use-transactions-query';
import {
  useTeamMembers,
  useSendInvitationEmail,
  useAcceptInvitation,
  useRemoveMember,
  useAssignStore,
  useUnassignStore,
  useAssignableStores,
  usePendingInvitations,
  useResendInvitation,
  useCancelInvitation,
} from './use-team-query';
import {
  useUserConfigurations,
  useCreateUserConfiguration,
  useUpdateUserConfiguration,
  useDeleteUserConfiguration,
  useToggleUserConfiguration,
} from './use-user-configurations-query';

export {
  // Auth hooks
  useNextAuth,
  useSession,

  // Data fetching hooks
  useUsers,

  // Transaction hooks
  useUserBalance,
  useTransactions,
  useTransaction,

  // Team management hooks
  useTeamMembers,
  useSendInvitationEmail,
  useAcceptInvitation,
  useRemoveMember,
  useAssignStore,
  useUnassignStore,
  useAssignableStores,
  usePendingInvitations,
  useResendInvitation,
  useCancelInvitation,

  // User configuration hooks
  useUserConfigurations,
  useCreateUserConfiguration,
  useUpdateUserConfiguration,
  useDeleteUserConfiguration,
  useToggleUserConfiguration,
  // Crawled product hooks
  useCrawledProducts,
  useCrawledProduct,
  useCreateCrawledProduct,
  useDeleteCrawledProduct,
  useBulkDeleteCrawledProducts,
};

