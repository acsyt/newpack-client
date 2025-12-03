import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { getErrorMessage } from '@/config/error.mapper';
import { CustomerDto } from '@/features/customers/customer.schema';
import { CustomerService } from '@/features/customers/customer.service';
import { customersKeys } from '@/features/customers/hook/customer.query';

export const useCustomersMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ data, id }: { data: CustomerDto; id: number | null }) => {
      if (id) return CustomerService.updateCustomer(id, data);

      return CustomerService.createCustomer(data);
    },
    onSuccess: ({ message, data }) => {
      toast.success(message);
      router.navigate({ to: '/customers' });
      queryClient.invalidateQueries({ queryKey: customersKeys.list({}) });
      queryClient.invalidateQueries({
        queryKey: customersKeys.detail(data.id)
      });
    },
    onError: error => {
      const message = getErrorMessage(error);

      toast.error(message);
    }
  });
};
