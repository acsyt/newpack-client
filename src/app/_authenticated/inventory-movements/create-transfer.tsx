import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CreateTransferContainer } from '@/features/inventory-movements/components/create-transfer-container/CreateTransferContainer';

export const Route = createFileRoute(
  '/_authenticated/inventory-movements/create-transfer'
)({
  component: () => (
    <DashboardLayoutContainer>
      <CreateTransferContainer />
    </DashboardLayoutContainer>
  )
});
