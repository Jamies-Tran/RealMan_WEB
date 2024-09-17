export type Paging<T> = {
  totalElement: number;
  totalPage: number;
  pageSize: number;
  currentPage: number;
  content: T[];
};
