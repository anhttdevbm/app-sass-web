import { Endpoint } from "api";
import { saleClientInstance } from "../../api/client";
import { useMutation } from "react-query";
import { getPath } from "utils/index";

interface TDeleteSection {
  budgetId: string;
  sectionId?: string;
  serviceId?: string;
}

export const budgetSectionDelete = (data: TDeleteSection) => {
  const url: string = getPath(
    Endpoint.BUDGET_SECTION_DELETE,
    { section_id: data.sectionId, service_id: data.serviceId },
    {
      id: data.budgetId,
    },
  );
  return saleClientInstance.delete(url);
};

export const useBudgetSectionDelete = () => {
  return useMutation({
    mutationFn: budgetSectionDelete,
  });
};
