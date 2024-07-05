import { Button, Stack } from "@mui/material";
import { NS_COMMON } from "constant/index";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect } from "react";

import useBreakpoint from "hooks/useBreakpoint";
// import useServiceHeader from "../../../../hooks/useServiceHeader";
import { useFormContext } from "react-hook-form";
import { useSalesService } from "store/sales/selectors";
import useServiceHeader from "components/sn-sales-detail/hooks/useServiceHeader";
import { EditContext } from "components/sn-sales-detail/components/sn-service/context/EditContext";

const ServiceHeader = () => {
  const commonT = useTranslations(NS_COMMON);
  const { isMdSmaller } = useBreakpoint();
  const { isEdit, setEdit } = useContext(EditContext);
  const { handleSubmit, getValues } = useFormContext();
  const { onSaveChange, onCancel } = useServiceHeader();
  const sectionsList = getValues("sectionsList");

  return (
    <Stack
      direction="row"
      width="100%"
      justifyContent={isEdit ? "flex-end" : "flex-start"}
    >
      {!isEdit ? (
        <Stack>
          {sectionsList.length !== 0 && (
            <Button
              variant="contained"
              size="medium"
              startIcon={
                <EditIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color: "inherit",
                  }}
                />
              }
              onClick={() => setEdit && setEdit(true)}
            >
              {commonT("edit")}
            </Button>
          )}
        </Stack>
      ) : (
        !isMdSmaller && (
          <Stack direction="row" spacing={2} sx={{}}>
            <Button variant="outlined" onClick={onCancel}>
              {commonT("form.cancel")}
            </Button>
            <Button onClick={handleSubmit(onSaveChange)} variant="contained">
              {commonT("form.save")}
            </Button>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default ServiceHeader;
