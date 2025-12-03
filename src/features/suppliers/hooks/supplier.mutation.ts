import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { SupplierDto } from '@/features/suppliers/supplier.schema';
import { SupplierService } from '@/features/suppliers/supplier.service';

import {  suppliersKeys } from '@/features/suppliers/hooks/supplier.query';

import { getErrorMessage } from '@/config/error.mapper';

export const useSupplierMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ data, id }: { data: SupplierDto; id: number | null }) => {
      if (id) return SupplierService.updateSupplier(id, data);

      return SupplierService.createSupplier(data);
    },
    onSuccess: ({ message, data }) => {
      toast.success(message);
      router.navigate({ to: '/suppliers' });
      queryClient.invalidateQueries({ queryKey: suppliersKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: suppliersKeys.detail(data.id) });
    },
    onError: error => {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  });
};
