export type Paging<T> = {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  current: number;
  content: T[];
};
