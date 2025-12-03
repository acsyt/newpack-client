import { useQuery } from '@tanstack/react-query';

import { ProductParams } from '../product.interface';
import { ProductService } from '../product.service';

export const productsKeys = {
  all: () => ['products'],
  list: (params: ProductParams) => [...productsKeys.all(), 'list', params]
} as const;

interface UseProductsQueryProps {
  options?: ProductParams;
  enabled?: boolean;
}

export const useProductsQuery = ({
  options = {},
  enabled = true
}: UseProductsQueryProps = {}) => {
  return useQuery({
    queryKey: productsKeys.list(options),
    queryFn: () => ProductService.findAllProducts(options),
    enabled: enabled ?? true
  });
};

export const useMeasureUnitsQuery = () => {
  return useQuery({
    queryKey: ['measure-units'],
    queryFn: () => ProductService.getAllMeasureUnits()
  });
};
