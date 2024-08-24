import { useCallback, useState } from "react";

export const usePagination = (
  initialPage: number,
  initialPageSize: number,
  onPageChange: (page: number, pageSize: number) => void,
) => {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onChangePage = useCallback(
    (newPage: number) => {
      setPageIndex(newPage);
      onPageChange(newPage, pageSize);
    },
    [pageSize, onPageChange],
  );

  const onChangeSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPageIndex(1);
      onPageChange(1, newPageSize);
    },
    [onPageChange],
  );

  return { pageIndex, pageSize, onChangePage, onChangeSize };
};
