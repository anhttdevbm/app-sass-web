"use client";
import { useEffect } from "react";

import { useAuth } from "store/app/selectors";
import { useCostRate } from "store/costRate/selectors";
import CostRateEmpty from "./CostRateEmpty";
import CostRateInfo from "./CostRateInfo";

const CostRate = () => {
  const { user } = useAuth();
  const { currentRate, onGetAllCostRate } = useCostRate();

  useEffect(() => {
    onGetAllCostRate()
      .then((data) => { return undefined; })
  }, [onGetAllCostRate])

  return (
    <>
    {
      currentRate?.id
        ? <CostRateInfo />
        : <CostRateEmpty fullname={user?.fullname} isEditable />
    }
    </>
  )
}

export default CostRate;