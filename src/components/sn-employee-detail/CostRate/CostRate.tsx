"use client";
import { useEffect } from "react";

import { useCostRate } from "store/employeeDetail/selectors";
import { useEmployeeDetailContext } from "../EmployeeDetailContext";
import CostRateEmpty from "./CostRateEmpty";
import CostRateInfo from "./CostRateInfo";

const CostRate = () => {
  const { selectAllCostRate, handleGetAllCostRate } = useCostRate();
  const { employee } = useEmployeeDetailContext();

  useEffect(() => {
    handleGetAllCostRate(employee.id);
  }, [employee, handleGetAllCostRate]);

  return (
    <>{selectAllCostRate.length > 0 ? <CostRateInfo /> : <CostRateEmpty />}</>
  );
};

export default CostRate;
