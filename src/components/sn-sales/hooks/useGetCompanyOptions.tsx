import { useEffect } from "react";
import { useCompanyOptions } from "store/manager/selectors";

const useGetCompanyOptions = () => {
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    filters,
  } = useCompanyOptions();

  const onEndReachedCompanyOptions = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);
    
  return {
    companyOptions: options,
    companyIsFetching: isFetching,
    onEndReachedCompanyOptions,
  };
};

export default useGetCompanyOptions;
