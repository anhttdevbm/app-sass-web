"use client";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CostRateEmptyImage from "public/images/img-cost-rate-empty.png";
import { Permission } from "constant/enums";
import { NS_COST_RATE } from "constant/index";
import { NewButton as Button, Text } from "components/shared";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import AddCircleIcon from "icons/AddCircleIcon";
import { useAuth } from "store/app/selectors";
import CostRateForm from "./CostRateForm";

const CostRateEmpty = () => {
  const { user } = useAuth();
  const costRateT = useTranslations(NS_COST_RATE);
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const { isMdSmaller } = useBreakpoint();

  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

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
            title={costRateT("empty.addCostRate")}
            onClose={() => {
              closeModal();
            }}
            sx={{ borderRadius: "24px" }}
          >
            <DialogContent>
              <CostRateForm
                costRateId={""}
                onCancel={() => {
                  closeModal();
                }}
              />
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
