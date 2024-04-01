import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { CareerData, GetCareerListQueries, getAllCareer, getCareerBySlug, postCareer, upadteCareer, updateStatusCareer, updateStatusCareerNew, getApplicantsByCareer, respondToApplicant } from "./action";
import { CareergDataForm } from "./type";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { ApplicantData } from "./action";

export const useCareer = () => {
  const dispatch = useAppDispatch();
  const {
    careers: items,
    careersStatus: status,
    careersError: error,
    careersFilters: filters,
    career: item,
    careerApplicants: applicants
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

  const onGetCareerBySlug = useCallback(
    async (slug: string) => {
      return await dispatch(getCareerBySlug(slug)).unwrap();
    },　[dispatch]
  )

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

  const onUpdateCareerStatusNew =  useCallback(
    async(careerList: CareerData[],opened:string)=>{
        try {
            const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
            return await dispatch(updateStatusCareerNew({ careerList: careerList,opened:opened, Token: Token })).unwrap();
        } catch (error) {
           throw error; 
        }
    },[dispatch]
  )

  const onGetCareerApplicants = useCallback(
    async (slug: string) => {
      return await dispatch(getApplicantsByCareer(slug)).unwrap();
    },　[dispatch]
  )

  const onRespondToApplicant = useCallback(
    async (data: ApplicantData, Token: string | undefined |null) => {
      try {
        return await dispatch(respondToApplicant({ data, Token })).unwrap();
      } catch (error) {
        throw error;
      }
    }, [dispatch]
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
    applicants,
    onUpdateCareerStatus,
    onUpdateCareerStatusNew,
    onGetCareerApplicants,
    onRespondToApplicant
  };
};