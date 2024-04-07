"use client";
import { useEffect } from "react";

import { useCostRate } from "store/employeeDetail/selectors";
import CostRateEmpty from "./CostRateEmpty";
import CostRateInfo from "./CostRateInfo";

const CostRate = () => {
  const { currentRate, handleGetAllCostRate } = useCostRate();

  useEffect(() => {
    handleGetAllCostRate()
  }, [handleGetAllCostRate])

  return (
    <>
    {
      currentRate?.id
        ? <CostRateInfo />
        : <CostRateEmpty />
    }
    </>
  )
}

export default CostRate;