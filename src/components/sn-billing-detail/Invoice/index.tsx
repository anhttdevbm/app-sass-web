import { Stack, Typography } from "@mui/material";
import { INVOICES_PATH } from "constant/paths";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import ChangeTemplateIcon from "icons/ChangeTemplateIcon";
import EditIcon from "icons/EditIcon";
import MarkAsSendIcon from "icons/MarkAsSendIcon";
import ShareInvoiceIcon from "icons/ShareInvoiceIcon";
import { useParams, usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import { Invoice, Service } from "store/invoice/reducer";
import { useInvoices } from "store/invoice/selectors";
import MoreButton from "./MoreButton";
import PdfButton from "./PdfButton";
import TemplateOne from "./TemplateOne";
import { downloadFile } from "utils/index";
import TemplateTwo from "./TemplateTwo";

export type Form = {
  service_items: Service[];
};
type TabProps = {
  title: string;
  editForm?: boolean;
  item?: Invoice;
  user?: User;
  arrBudgets?: Budgets[];
  form: FormikProps<Billing>;
  billToInfo: Bill;
  setBillToInfo: (value: Bill) => void;
  billFromInfo: Bill;
  setBillFromInfo: (value: Bill) => void;
};

const TabInvoice = (props: TabProps) => {
  const { user } = props;
  const {
    item: itemInvoice,
    onGetInvoiceDetail,
    onDeleteInvoice,
    onUpdateInvoice,
  } = useInvoices();
  const printRef = useRef(null);

  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const pathname = usePathname();
  const { onAddSnackbar } = useSnackbar();

  const formik = useFormik<Form>({
    initialValues: {
      service_items: itemInvoice?.service_items ?? [],
    },
    onSubmit: async (formData) => {
      try {
        await onUpdateInvoice(formData.service_items, id as string);
        onAddSnackbar("Updated!", "success");
        if (typeof id === "string") {
          onGetInvoiceDetail(id);
        }
        setIsEdit(false);
      } catch (er) {
        onAddSnackbar("Failed to update", "error");
      }
    },
  });

  const handleChange = (name, value) => {
    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    handleChange("service_items", itemInvoice?.service_items);
  }, [itemInvoice]);

  useEffect(() => {
    if (formik.values.service_items) {
      formik.values.service_items.forEach((service, index) => {
        const amount =
          (Number(service.rate) ?? 0) * (Number(service.quantity) ?? 0);
        if (amount != Number(formik.values.service_items[index].amount)) {
          handleChange(`service_items[${index}].amount`, amount);
        }
      });
    }
  }, [formik.values]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      return;
    }

    const copiedItems = formik.values.service_items;
    const [removed] = copiedItems.slice().splice(source.index, 1);
    copiedItems.slice().splice(destination.index, 0, removed);
    handleChange("service_items", copiedItems);
  };

  useEffect(() => {
    if (typeof id === "string") {
      onGetInvoiceDetail(id);
    }
  }, [id]);

  const handleClickShare = async () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
    const URL = `${origin}${pathname}`;
    try {
      await navigator.clipboard.writeText(URL);
      onAddSnackbar("Copied!", "success");
    } catch (er) {
      onAddSnackbar("Failed to copy", "error");
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      await onDeleteInvoice(id as string);
      push(INVOICES_PATH);
      onAddSnackbar("Deleted", "success");
    } catch (error) {
      onAddSnackbar("Failed to delete", "error");
    }
  };

  const handleDownloadPdf = () => downloadFile(printRef);

  const listChoice = [
    {
      icon: (
        <EditIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />
      ),
      title: "Edit",
      action: () => setIsEdit((prev) => !prev),
    },
    {
      icon: (
        <MarkAsSendIcon
          sx={{ width: "12px", height: "12px", margin: "auto 0" }}
        />
      ),
      title: "Mark As Send",
      action: () => onAddSnackbar("Mark as sent!", "success"),
    },
    {
      icon: (
        <ShareInvoiceIcon
          sx={{ width: "12px", height: "12px", margin: "auto 0" }}
        />
      ),
      title: "Share",
      action: () => handleClickShare(),
    },
  ];

  return (
    <Stack mt={2} sx={{ overflowY: "auto", height: "60vh" }}>
      <Stack
        gap={1}
        direction="row"
        sx={{ borderBottom: "1.5px solid #EBEAF2" }}
      >
        {listChoice.map((choice, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{
              borderRight: "1.5px solid #EBEAF2",
              display: "flex",
              gap: "8px",
              padding: "0px 8px",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={choice.action}
          >
            {choice.icon}
            <Typography fontSize={14} fontWeight={400} color="#000000">
              {choice.title}
            </Typography>
          </Stack>
        ))}

        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
            alignItems: "center",
          }}
        >
          <ChangeTemplateIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            Change Template
          </Typography>
        </Stack>

        <PdfButton handleDownloadPdf={handleDownloadPdf} />
        <MoreButton onDeleteInvoice={handleDeleteInvoice} />
      </Stack>

      {/* Main */}
      <Stack ref={printRef} width="fit-content">
        {/* <TemplateOne
          itemInvoice={itemInvoice}
          user={user}
          isEdit={isEdit}
          formik={formik}
          handleChange={handleChange}
          onDragEnd={onDragEnd}
        /> */}
        <TemplateTwo
          itemInvoice={itemInvoice}
          user={user}
          isEdit={isEdit}
          formik={formik}
          handleChange={handleChange}
          onDragEnd={onDragEnd}
        />
      </Stack>
    </Stack>
  );
};

export default memo(TabInvoice);
