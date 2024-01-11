import { Box, Stack, Typography } from "@mui/material";
import { H6, PTag, ServiceBox } from "./ServiceUtil";

export const ServiceAreaTotal = () => {
  return (
    <Box p="15px">
      <Stack gap={1} direction="row">
        <Box sx={{ flex: 1, "& .MuiStack-root": { height: "100%" } }}>
          <ServiceBox remaining="56%">
            <Stack direction="row" justifyContent="space-between">
              <H6>TIME</H6>
              <PTag>15 Jun, 2023</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>Budgeted time</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>Billable time</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>Estimated time</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>Worked time</H6>
              <PTag>00:00</PTag>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <H6>Remaining time (56%)</H6>
              <PTag>00:00</PTag>
            </Stack>
          </ServiceBox>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack direction="column" gap={1}>
            <ServiceBox remaining="20%">
              <Stack direction="row" justifyContent="space-between">
                <H6>PROFIT</H6>
                <PTag>15 Jun, 2023</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Revenue</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Cost</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Profit (20%)</H6>
                <PTag>$0,00</PTag>
              </Stack>
            </ServiceBox>
            <ServiceBox remaining="50%">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <H6>BUDGET</H6>
                <PTag>15 Jun, 2023</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Budget total</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Budget used</H6>
                <PTag>$0,00</PTag>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <H6>Budget remaining</H6>
                <PTag>$0,00</PTag>
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack
            direction="column"
            gap={1}
            sx={{ height: '100%', "& .MuiStack-root": { flexGrow: 1 } }}
          >
            <ServiceBox>
              <Stack justifyContent="space-between" height="100%">
                <H6>INVOICING</H6>
                <Typography component="p" fontSize="small">
                  Invoicing is not available for internal budgets.
                </Typography>
              </Stack>
            </ServiceBox>
            <ServiceBox>
              <Stack justifyContent="space-between" height="100%">
                <H6>INVOICING</H6>
                <Typography component="p" fontSize="small">
                  Invoicing is not available for internal budgets.
                </Typography>
              </Stack>
            </ServiceBox>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
