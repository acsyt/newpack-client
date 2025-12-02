import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { SuppliersFormContainer } from '@/features/suppliers/components/SupplierFormContainer';

export const Route = createFileRoute(
  '/_authenticated/suppliers/$supplierId/show'
)({
  component: RouteComponent
});

function RouteComponent() {
  const { supplierId } = Route.useParams();

  return (
    <SuppliersFormContainer
      mode={ModeAction.Show}
      supplierId={Number(supplierId)}
      title='Detalles proveedor'
    />
  );
}
