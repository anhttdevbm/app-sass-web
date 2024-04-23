"use client";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Formik } from "formik";

import CostRateEmptyImage from "public/images/img-cost-rate-empty.png";
import { NS_COMMON, NS_COST_RATE } from "constant/index";
import { NewButton as Button, Text } from "components/shared";
import CostRateForm, { NewCostRateForm } from "./CostRateForm";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import AddCircleIcon from "icons/AddCircleIcon";
import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import { useAuth, useSnackbar } from "store/app/selectors";
import { NewCostRate } from "store/employeeDetail/actions";
import { useCostRate } from "store/employeeDetail/selectors";
import { Permission } from "constant/enums";
import { getMessageErrorByAPI } from "utils/index";

const CostRateEmpty = () => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { onAddSnackbar } = useSnackbar();
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const { isMdSmaller } = useBreakpoint();
  const { handleAddNewCostRate } = useCostRate();

  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

  const onSubmit = async (values: NewCostRateForm) => {
    try {
      const data = {
        ...values,
        working_hours: [
          values.working_hours.mon,
          values.working_hours.tue,
          values.working_hours.wed,
          values.working_hours.thu,
          values.working_hours.fri,
          values.working_hours.sat,
          values.working_hours.sun,
        ],
      } as NewCostRate;
      await handleAddNewCostRate(data);
      onAddSnackbar(costRateT("empty.notification.addSuccess"), "success");
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const initialValues = useMemo(
    () => ({
      type: "",
      cost_per_month: 0,
      currency: "",
      total_hours: 0,
      holiday_calendar: "",
      note: "",
      working_hours: {
        mon: 8,
        tue: 8,
        wed: 8,
        thu: 8,
        fri: 8,
        sat: 0,
        sun: 0,
      },
      over_head: true,
    }),
    [],
  ) as NewCostRateForm;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Image
          src={CostRateEmptyImage}
          alt="Cost Rate Empty Illustration"
          width={isMdSmaller ? 180 : 250}
        />
      </Box>
      <Text
        variant="h3"
        textAlign="center"
        fontSize={{
          xs: 20,
          sm: 24,
        }}
        fontWeight={600}
        pt={4}
      >
        <span style={{ color: "#045EB8" }}>{user?.fullname}</span>{" "}
        {costRateT("empty.title")}
      </Text>
      <Text
        variant="h5"
        textAlign="center"
        fontSize="16px"
        fontWeight={400}
        pt={3}
        color="grey.700"
      >
        {costRateT("empty.subtitle")}
      </Text>

      {isAdmin ? (
        <>
          <Button
            variant="primary"
            size="medium"
            sx={{
              mt: {
                xs: 4,
                sm: 2,
              },
              mb: {
                xs: 4,
                sm: 7,
              },
            }}
            startIcon={<AddCircleIcon />}
            onClick={() => {
              openModal();
            }}
          >
            {costRateT("empty.addCostRate")}
          </Button>

          <DefaultPopupLayout
            open={isModalOpen}
            title="Add New Cost Rate"
            onClose={() => {
              closeModal();
            }}
            sx={{ borderRadius: "24px" }}
          >
            <DialogContent>
              <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {(props) => (
                  <CostRateForm
                    formik={props}
                    onCancel={() => {
                      closeModal();
                    }}
                  />
                )}
              </Formik>
            </DialogContent>
          </DefaultPopupLayout>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CostRateEmpty;
