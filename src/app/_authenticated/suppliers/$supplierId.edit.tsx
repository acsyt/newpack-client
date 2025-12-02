import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { SuppliersFormContainer } from '@/features/suppliers/components/SupplierFormContainer';

export const Route = createFileRoute(
  '/_authenticated/suppliers/$supplierId/edit'
)({
  component: RouteComponent
});

function RouteComponent() {
  const { supplierId } = Route.useParams();

  return (
    <SuppliersFormContainer
      mode={ModeAction.Edit}
      supplierId={Number(supplierId)}
      title='Editar proveedor'
    />
  );
}
