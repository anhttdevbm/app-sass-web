import { Box, Stack, Typography } from "@mui/material";
import { Button } from "components/shared";
import Image from "next/image";
import { ModalAddRecurring } from "./Modals/ModalAddRecurring";
import useToggle from "hooks/useToggle";

export type TRecurring = {
  recurring: string;
  from: string;
  to: string;
  copyPO?: boolean;
  budgetId: string;
};

export const Recurring = () => {
  const [
    isOpenModalAddRecurring,
    showModalAddRecurring,
    hideModalAddRecurring,
  ] = useToggle();

  return (
    <>
      <Box py="50px">
        <Stack alignItems="center">
          <Box mb={5}>
            <Image
              src="/images/budget_no_recurring.png"
              alt="Budget No Recurring"
              width={185}
              height={159}
            />
          </Box>
          <Box mb={3}>
            <Button
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.light", color: "primary.main" },
              }}
              onClick={showModalAddRecurring}
            >
              Make this recurring Budget
            </Button>
          </Box>
          <Box mb={3}>
            <Typography component="h5" fontSize="h5" fontWeight="bold">
              This budget is not recurring
            </Typography>
          </Box>
          <Box>
            <Typography
              component="p"
              width="100%"
              maxWidth="550px"
              align="center"
            >
              A recurring budget is automatically generated weekly, biweekly,
              monthly, quarterly, semiannually or annually. The frequency
              depends on your preference. Make this a recurring budget
            </Typography>
          </Box>
        </Stack>
      </Box>

      <ModalAddRecurring
        open={isOpenModalAddRecurring}
        onClose={hideModalAddRecurring}
        refetch={() => {       
        }}
      />
    </>
  );
};
