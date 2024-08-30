export type Paging = {
  size: number;
  totalPage: number;
  currentPage: number;
};

export type Pageable<T> = {
  data: Array<T>;
  paging: Paging;
};
