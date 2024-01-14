/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Box,
  ButtonBase,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  Typography,
  popoverClasses,
} from "@mui/material";
import { CellProps, TableLayout } from "components/Table";
import { NS_BUDGETING } from "constant/index";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Text } from "components/shared";
import ServiceAreaSectionRow from "./ServiceAreaSectionRow";
import {
  TBudgetSection,
  TBudgetService,
  budgetDetailRef,
} from "components/sn-budgeting/BudgetDetail";
import _ from "lodash";

export const ServiceAreaSection = ({
  sections = [],
}: {
  sections: TBudgetSection[];
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const budgetT = useTranslations(NS_BUDGETING);

  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));

  const headerList: CellProps[] = [
    {
      value: budgetT("tabService.section.serviceName"),
      align: "left",
      minWidth: 350,
    },
    {
      value: budgetT("tabService.section.estimate"),
      align: "center",
      minWidth: 60,
    },
    {
      value: budgetT("tabService.section.price"),
      align: "center",
      minWidth: 60,
    },
    {
      value: budgetT("tabService.section.totalBudget"),
      align: "center",
      minWidth: 100,
    },
    { value: "", align: "left", width: "3%" },
  ];

  return (
    <>
      {_.map(sections, (section: TBudgetSection, index) => {
        return (
          <Stack
            key={index}
            sx={{
              mb: 2,
              overflow: {
                xs: "auto",
              },
              pr: 1,
            }}
          >
            <Typography variant="h4" sx={{ p: 2 }}>
              {_.get(section, "name", "")}
            </Typography>
            <TableLayout
              headerList={headerList}
              noData={false}
              titleColor="grey.300"
              maxHeight={920}
              headerProps={{
                sx: {
                  px: 2,
                },
              }}
              sx={{
                minHeight: 100,
                minWidth: {
                  md: 1320,
                  xs: 1320,
                  overflow: "visible",
                },
                width: "100%",
                [`&.MuiTableCell-root :first-child`]: {
                  pl: 4,
                },
              }}
            >
              {_.map(
                _.get(section, "services", []),
                (service: TBudgetService, serviceIndex: number | string) => {
                  return (
                    <ServiceAreaSectionRow
                      key={`budget-sevice-section-${serviceIndex}`}
                      service={service}
                      setAnchorEl={setAnchorEl}
                      anchorEl={anchorEl}
                    />
                  );
                },
              )}
            </TableLayout>
          </Stack>
        );
      })}

      <Popper
        ref={refClickOutSide}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "white",
            minWidth: 150,
            maxWidth: 250,
          },
          zIndex: 1000,
        }}
        transition
        placement={"bottom-end"}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Stack
              py={2}
              sx={{
                boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
                border: "1px solid",
                borderTopWidth: 0,
                borderColor: "grey.100",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <MenuList component={Box} sx={{ py: 0 }}>
                <MenuItem
                  onClick={() => {
                    budgetDetailRef.current?.openModalTime();
                  }}
                  component={ButtonBase}
                  sx={{ width: "100%", py: 1, px: 2 }}
                >
                  <Text ml={2} variant="body2" color="grey.400">
                    Add time entry
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    budgetDetailRef.current?.openModalExpense();
                  }}
                  component={ButtonBase}
                  sx={{ width: "100%", py: 1, px: 2 }}
                >
                  <Text ml={2} variant="body2" color="grey.400">
                    Add expense
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={() => {}}
                  component={ButtonBase}
                  sx={{ width: "100%", py: 1, px: 2 }}
                >
                  <Text ml={2} variant="body2" color="grey.400">
                    View time entries
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={() => {}}
                  component={ButtonBase}
                  sx={{ width: "100%", py: 1, px: 2 }}
                >
                  <Text ml={2} variant="body2" color="grey.400">
                    View expenses
                  </Text>
                </MenuItem>
              </MenuList>
            </Stack>
          </Grow>
        )}
      </Popper>
    </>
  );
};
