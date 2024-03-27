import { Button, Stack } from "@mui/material";
import { NS_COMMON } from "constant/index";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";
import { EditContext } from "../../context/EditContext";
import useServiceHeader from "../../../../hooks/useServiceHeader";
import { useFormContext } from "react-hook-form";

const ServiceHeaderMobile = () => {
  const commonT = useTranslations(NS_COMMON);
  const { isEdit } = useContext(EditContext);
  const { handleSubmit } = useFormContext();
  const { onSaveChange, onCancel } = useServiceHeader();

  return (
    <Stack direction="row" justifyContent={isEdit ? "flex-end" : "flex-start"}>
      {isEdit && (
        <Stack direction="row" spacing={2} width="100%">
          <Button variant="outlined" fullWidth onClick={onCancel}>
            {commonT("form.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSaveChange)}
            fullWidth
            variant="contained"
          >
            {commonT("form.save")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ServiceHeaderMobile;
