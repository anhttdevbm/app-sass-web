import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { CareerData, GetCareerListQueries, getAllCareer, getCareerBySlug, postCareer, upadteCareer, updateStatusCareer } from "./action";
import { CareergDataForm } from "./type";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";

export const useCareer = () => {
  const dispatch = useAppDispatch();
  const {
    careers: items,
    careersStatus: status,
    careersError: error,
    careersFilters: filters,
    career: item,
  } = useAppSelector((state) => state.career, shallowEqual);

  const { page, size, totalItems, total_page } = useAppSelector(
    (state) => state.career.careersPaging,
    shallowEqual,
  );
  

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetCareer = useCallback(
    async (queries: GetCareerListQueries) => {
      await dispatch(getAllCareer(queries));
    },
    [dispatch],
  );

  const onCreateNewCareer = useCallback(
    async (data: CareergDataForm, Token: string | undefined | null) => {
      try {
        return await dispatch(postCareer({ data, Token })).unwrap();
      } catch (error) {
        throw error;
      }
    }, [dispatch]
  );

  const onUpdateCareer = useCallback(
    async (id: string, data: CareergDataForm, Token: string | undefined | null) => {
      try {
        return await dispatch(upadteCareer({ id, data, Token })).unwrap();
      } catch (error) {
        throw error;
      }
    }, [dispatch]
  )

  const onGetCareerBySlug = async (slug: string) => {
    return await dispatch(getCareerBySlug(slug)).unwrap();
  };

  const onUpdateCareerStatus =  useCallback(
    async(careerList: CareerData[],opened:boolean)=>{
        try {
            const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
            return await dispatch(updateStatusCareer({ careerList: careerList,opened:opened, Token: Token })).unwrap();
        } catch (error) {
           throw error; 
        }
    },[dispatch]
  )
  return {
    onGetCareer,
    onCreateNewCareer,
    onUpdateCareer,
    onGetCareerBySlug,
    items,
    item,
    totalItems,
    total_page,
    page,
    size,
    error,
    status,
    isIdle,
    isFetching,
    filters,
    onUpdateCareerStatus
  };
};