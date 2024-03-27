"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Sales } from "store/sales/reducer";
import SalesDetail from "./SaleDetail";
import { SALE_STAGE } from "constant/enums";
import { EditProvider } from "./components/sn-service/context/EditContext";

const SaleForm = ({ params }) => {
  // form control
  const method = useForm({
    defaultValues: {
      name: "",
      description: "",
      avatar: [],
      activity: [],
      comment: [],
      company: "",
      created_time: "",
      todo_list: {},
      created_by: {},
      currency: "",
      estimate: 0,
      id: params.id,
      is_active: false,
      members: [],
      owner: {},
      probability: 0,
      revenue: 0,
      revenuePJ: 0,
      stage: "",
      start_date: "",
      tags: [],
      updated_time: "",
      todoItem: {},
      comments: [],
      attachments: [],
      attachments_down: [],
      status: SALE_STAGE.LEAD,
      deletedSections: [],
      sectionsList: [],
    },
    mode: "onChange",
  });

  return (
    <FormProvider {...method}>
      <EditProvider>
        <SalesDetail />
      </EditProvider>
    </FormProvider>
  );
};

export default SaleForm;
