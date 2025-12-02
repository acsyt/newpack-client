import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { SuppliersFormContainer } from '@/features/suppliers/components/SupplierFormContainer';

export const Route = createFileRoute('/_authenticated/suppliers/create')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SuppliersFormContainer mode={ModeAction.Create} title='Crear proveedor' />
  );
}
