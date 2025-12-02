import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProductParams } from '../product.interface';
import { ProductDto } from '../product.schema';
import { ProductService } from '../product.service';

import { productsKeys } from './products.query';

import { getErrorMessage } from '@/config/error.mapper';

export const useSaveRawMaterialMutation = ({
  id,
  productParams,
  onClose
}: {
  id?: number;
  productParams: ProductParams;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductDto) => {
      if (id) return ProductService.updateProduct(id, data);

      return ProductService.createProduct(data);
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: productsKeys.list(productParams)
      });
      onClose();
    },
    onError: error => {
      const message = getErrorMessage(error);

      toast.error(message);
    }
  });
};
