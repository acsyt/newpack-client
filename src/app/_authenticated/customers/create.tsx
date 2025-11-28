import { ModeAction } from '@/config/enums/mode-action.enum';
import { CustomerFormContainer } from '@/features/customers/components/CustomerFormContainer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/customers/create')({
  component: RouteComponent
});

function RouteComponent() {
  return <CustomerFormContainer mode={ModeAction.Create} title='Crear Cliente' />;
}
