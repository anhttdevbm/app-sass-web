"use client";

import { useAuth } from "store/app/selectors";

import CostRateEmpty from "./CostRateEmpty";

const CostRate  = () => {
  const { user } = useAuth();

  return (
    <CostRateEmpty fullname={user?.fullname} />
  )
}

export default CostRate;