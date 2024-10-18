import { Button, Stack } from "@mui/material";
import { NS_COMMON } from "constant/index";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect } from "react";
import { EditContext } from "../../context/EditContext";
import useBreakpoint from "hooks/useBreakpoint";
import useServiceHeader from "../../../../hooks/useServiceHeader";
import { useFormContext } from "react-hook-form";
import { useSalesService } from "store/sales/selectors";

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
              sx={{
                height: 40,
                borderRadius: 50,
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                width: 100
              }}
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
            <Button 
             sx={{
              height: 40,
              borderRadius: 50,
              width: 100,
              fontWeight : 700
            }}
            variant="outlined" 
            onClick={onCancel}>
              {commonT("form.cancel")}
            </Button>
            <Button
              sx={{
                height: 40,
                borderRadius: 50,
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                width: 100,
                fontWeight : 700
              }}
              onClick={handleSubmit(onSaveChange)}
              variant="contained"
            >
              {commonT("form.save")}
            </Button>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default ServiceHeader;
