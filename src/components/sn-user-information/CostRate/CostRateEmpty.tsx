"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CostRateEmptyImage from "public/images/img-cost-rate-empty.png";
import { NS_COST_RATE } from "constant/index";
import { NewButton as Button, Text } from "components/shared";
import CostRateForm from "./CostRateForm";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import AddCircleIcon from "icons/AddCircleIcon";
import useBreakpoint from "hooks/useBreakpoint";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";

const CostRateEmpty = () => {
  const { user } = useAuth();
  const costRateT = useTranslations(NS_COST_RATE);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const { isSmSmaller } = useBreakpoint();

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Image
          src={CostRateEmptyImage}
          alt="Cost Rate Empty Illustration"
          width={ isSmSmaller ? 200 : 320 }
        />
      </Box>
      <Text
        variant="h3"
        textAlign="center"
        fontSize={{
          xs: "20px",
          sm: "25px",
        }}
        fontWeight={600}
        pt={4}
      >
        <span style={{ color: "#045EB8" }}>{user?.fullname}</span> {costRateT("empty.title")}
      </Text>
      <Text variant="h5" textAlign="center" fontSize="16px" fontWeight={400} pt={3} color="grey.700">{costRateT("empty.subtitle")}</Text>

      {
        user?.roles.includes(Permission.AM)
          ? <>
            <Button
              variant="primary"
              sx={{
                marginTop: {
                  xs: "36px",
                  sm: "20px",
                },
                marginBottom: {
                  xs: "36px",
                  sm: "64px",
                },
              }}
              startIcon={<AddCircleIcon />}
              onClick={() => { setModalOpen(true) }}
            >
              {costRateT("empty.addCostRate")}
            </Button>

            <DefaultPopupLayout
              open={isModalOpen}
              title="Add New Cost Rate"
              onClose={() => { setModalOpen(false) }}
            >
              <DialogContent>
                <CostRateForm
                  onConfirm={() => undefined}
                  onCancel={() => { setModalOpen(false) }}
                />
              </DialogContent>
            </DefaultPopupLayout>
          </>
          : <></>
      }

    </Box>
  )
};

export default CostRateEmpty;