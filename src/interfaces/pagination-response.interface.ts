export interface PaginationResponse<T> {
  data: T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

export interface Response<T> {
  data: T;
  message: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface BasePaginationParams<
  TFilter = Record<string, any>,
  TRelation = string
> {
  include?: TRelation[];
  filter?: TFilter & { q?: string };
  has_pagination?: boolean;
  page?: number;
  per_page?: number;
  sort?: string;
}
