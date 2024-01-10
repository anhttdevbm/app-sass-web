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
};

export const Service = ({
  isEdit = false,
  sections = [],
  onCloseEdit,
}: Props) => {
  return isEdit ? (
    <ServiceSection sectionsList={sections} onCloseEdit={onCloseEdit} />
  ) : (
    <Box>
      <ServiceAreaTotal />
      <ServiceAreaSection sections={sections} />
    </Box>
  );
};
