import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import FormLayout from "components/FormLayout";
import { INVOICES_PATH } from "constant/paths";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import ChangeTemplateIcon from "icons/ChangeTemplateIcon";
import EditIcon from "icons/EditIcon";
import MarkAsSendIcon from "icons/MarkAsSendIcon";
import ShareInvoiceIcon from "icons/ShareInvoiceIcon";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import TemplateTwoPng from "public/images/template-two.png";
import { memo, useEffect, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import { Invoice, Service } from "store/invoice/reducer";
import { useInvoices } from "store/invoice/selectors";
import { downloadFile } from "utils/index";
import MoreButton from "./MoreButton";
import PdfButton from "./PdfButton";
import TemplateOne from "./TemplateOne";
import TemplateThree from "./TemplateThree";
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
const ITEM_HEIGHT = 48;

const TabInvoice = (props: TabProps) => {
  const { user } = props;
  const {
    item: itemInvoice,
    onGetInvoiceDetail,
    onDeleteInvoice,
    onUpdateInvoice,
  } = useInvoices();
  const printRef = useRef(null);
  const hash = window.location.hash;

  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const pathname = usePathname();
  const { onAddSnackbar } = useSnackbar();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const URL = `${origin}${pathname}`;
  const [selectedUrl, setSelectedUrl] = useState(hash);

  const [chooseTemplateModal, setChooseTemplateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newHash) => {
    console.log(newHash);

    setSelectedUrl(URL + "#" + newHash);
    setAnchorEl(null);
  };

  useEffect(() => {
    push(selectedUrl);
  }, [selectedUrl]);

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

  // useEffect(() => {
  //   if (formik.values.service_items) {
  //     formik.values.service_items.forEach((service, index) => {
  //       const amount =
  //         (Number(service.rate) ?? 0) * (Number(service.quantity) ?? 0);
  //       if (amount != Number(formik.values.service_items[index].amount)) {
  //         handleChange(`service_items[${index}].amount`, amount);
  //       }
  //     });
  //   }
  // }, [formik.values]);

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

  const listTemplate = [
    {
      key: "template-one",
      value: "Template 1",
      imageUrl: "/images/template-one.svg",
    },
    {
      key: "template-two",
      value: "Template 2",
      imageUrl: TemplateTwoPng,
    },
    {
      key: "template-three",
      value: "Template 3",
      imageUrl: "/images/template-three.svg",
    },
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(listTemplate[0]);
  const [choosingTemplate, setChoosingTemplate] = useState(listTemplate[0]);

  const handleCloseModalTemplate = () => {
    handleClose(choosingTemplate.key);
    setChooseTemplateModal(false);
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
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(URL);
        onAddSnackbar("Copied!", "success");
      } catch (er) {
        onAddSnackbar("Failed to copy", "error");
      }
    } else {
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
        sx={{
          borderBottom: "1.5px solid #EBEAF2",
          position: "sticky",
          top: 0,
          background: "#ffffff",
        }}
      >
        {listChoice.map((choice, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{
              borderRight: "1.5px solid #EBEAF2",
              display: "flex",
              gap: "8px",
              padding: "6px 8px",
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
            padding: "0px 8px",
            alignItems: "center",
          }}
        >
          <ChangeTemplateIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Typography fontSize={14} fontWeight={400} color="#000000">
              Change Template
            </Typography>
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose(hash)}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "25ch",
              },
            }}
          >
            {listTemplate.map((template, index) => (
              <MenuItem
                key={index}
                onClick={() => handleClose(template.key)}
                sx={{
                  "&:hover": {
                    background: "rgba(217, 240, 253, 0.5)",
                  },
                  padding: "10px",
                }}
              >
                <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                  {template.value}
                </Typography>
              </MenuItem>
            ))}
            <MenuItem
              key={listTemplate.length}
              onClick={() => {
                setChooseTemplateModal(true);
                setAnchorEl(null);
              }}
              sx={{
                "&:hover": {
                  background: "rgba(217, 240, 253, 0.5)",
                },
                padding: "10px",
              }}
            >
              <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                All template
              </Typography>
            </MenuItem>
          </Menu>
        </Stack>

        <PdfButton
          selectedTemplateHash={selectedUrl.split("#")[1]}
          handleDownloadPdf={handleDownloadPdf}
        />
        <MoreButton onDeleteInvoice={handleDeleteInvoice} />
      </Stack>
      <FormLayout
        sx={{
          minWidth: { xs: "calc(100vw - 24px)", lg: 800 },
          maxWidth: { xs: "calc(100vw - 24px)", sm: 800 },
          minHeight: "auto",
        }}
        open={chooseTemplateModal}
        submitText="Choose"
        cancelText={"Cancel"}
        onClose={() => setChooseTemplateModal(false)}
        onSubmit={handleCloseModalTemplate}
        isAllTemplate={true}
        submitWhenEnter={false}
      >
        <Typography
          fontSize={20}
          fontWeight={600}
          color="#4D4D4D"
          sx={{ marginBottom: "14px" }}
        >
          All template
        </Typography>
        <Grid container>
          {listTemplate.map((template, index) => (
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "184px",
                  height: "172px",
                  padding: "1px",
                  background:
                    template.key == choosingTemplate.key
                      ? "linear-gradient(to right, #2AF598, #009EFD)"
                      : "transparent",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
                onClick={() => setChoosingTemplate(template)}
              >
                <Image
                  src={template.imageUrl}
                  width={182}
                  height={170}
                  alt={template.value}
                  style={{
                    objectFit: "cover",
                    borderRadius: "12px",
                    background: "white",
                  }}
                />
              </Box>
              <Typography
                textAlign="center"
                fontWeight={600}
                fontSize={14}
                color="#212529"
              >
                {template.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </FormLayout>
      {/* Main */}

      <Stack ref={printRef} width="fit-content" margin="auto">
        {(!Boolean(selectedUrl) || selectedUrl.includes("template-one")) && (
          <TemplateOne
            itemInvoice={itemInvoice}
            user={user}
            isEdit={isEdit}
            formik={formik}
            handleChange={handleChange}
            onDragEnd={onDragEnd}
          />
        )}
        {selectedUrl.includes("template-two") && (
          <TemplateTwo
            itemInvoice={itemInvoice}
            user={user}
            isEdit={isEdit}
            formik={formik}
            handleChange={handleChange}
            onDragEnd={onDragEnd}
          />
        )}
        {selectedUrl.includes("template-three") && (
          <TemplateThree
            itemInvoice={itemInvoice}
            user={user}
            isEdit={isEdit}
            formik={formik}
            handleChange={handleChange}
            onDragEnd={onDragEnd}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default memo(TabInvoice);
