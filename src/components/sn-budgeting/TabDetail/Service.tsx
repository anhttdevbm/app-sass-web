/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Box } from "@mui/material";
import { ServiceAreaTotal } from "./Services/ServiceAreaTotal";
import { ServiceAreaSection } from "./Services/ServiceAreaSection";
import { ServiceSection } from "./Services/ServiceSection";
import { TBudgetSection } from "../BudgetDetail";

type Props = {
  isEdit?: boolean;
  onCloseEdit?: () => void;
  sections: TBudgetSection[];
  serviceData: any;
};

export const Service = ({
  isEdit = false,
  sections = [],
  onCloseEdit,
  serviceData
}: Props) => {
  return isEdit ? (
    <ServiceSection sectionsList={sections} onCloseEdit={onCloseEdit} />
  ) : (
    <Box>
      <ServiceAreaTotal serviceData={serviceData} />
      <ServiceAreaSection sections={sections} />
    </Box>
  );
};
