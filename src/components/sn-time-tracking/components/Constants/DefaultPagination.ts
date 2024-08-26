// import { IPaginationFilter } from '@interfaces/PaginationMeta.interface';

const DEFAULT_PAGINATION: {
  page: number;
  limit: number;
  orderBy: string;
  keyword: string;
  status: string;
} = {
  page: 1,
  limit: 10,
  orderBy: "ASC",
  keyword: "",
  status: "",
};

const DEFAULT_LOADING_STATES = {
  isFetchLoading: false,
  isGetLoading: false,
  isActionLoading: false,
};

export { DEFAULT_PAGINATION, DEFAULT_LOADING_STATES };
