/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Box } from "@mui/material";
import { TBudgetSection } from "../BudgetDetail";
import { ServiceAreaSection } from "./Services/ServiceAreaSection";
import { ServiceAreaTotal } from "./Services/ServiceAreaTotal";
import ServiceSection from "./Services/ServiceSection";

type Props = {
  isEdit?: boolean;
  onCloseEdit?: () => void;
  refetch: () => void;
  sections: TBudgetSection[];
  serviceData: any;
};

export const Service = ({
  isEdit = false,
  sections = [],
  onCloseEdit,
  refetch,
  serviceData
}: Props) => {
  return isEdit ? (
    <ServiceSection sectionsList={sections} onCloseEdit={onCloseEdit} refetch={refetch} />
  ) : (
    <Box>
      <ServiceAreaTotal serviceData={serviceData} />
      <ServiceAreaSection sections={sections} />
    </Box>
  );
};
