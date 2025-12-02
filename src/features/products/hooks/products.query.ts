import { useQuery } from '@tanstack/react-query';

import { ProductParams } from '../product.interface';
import { ProductService } from '../product.service';

export const productsKeys = {
  all: () => ['products'],
  list: (params: ProductParams) => [...productsKeys.all(), 'list', params]
} as const;

interface UseProductsQueryProps {
  options?: ProductParams;
}

export const useProductsQuery = ({
  options = {}
}: UseProductsQueryProps = {}) => {
  return useQuery({
    queryKey: productsKeys.list(options),
    queryFn: () => ProductService.findAllProducts(options)
  });
};

export const useMeasureUnitsQuery = () => {
  return useQuery({
    queryKey: ['measure-units'],
    queryFn: () => ProductService.getAllMeasureUnits()
  });
};
