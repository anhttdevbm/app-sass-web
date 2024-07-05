import { useEffect } from "react";
import { useProjectTypeOptions } from "store/global/selectors";

const useGetProjectTypeOptions = () => {
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
  } = useProjectTypeOptions();

  const onEndReachedProjectTypeOptions = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ pageSize, pageIndex: pageIndex + 1 });
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);
    
  return {
    projectTypeOptions: options,
    projectTypeIsFetching: isFetching,
    onEndReachedProjectTypeOptions,
  };
};

export default useGetProjectTypeOptions;
