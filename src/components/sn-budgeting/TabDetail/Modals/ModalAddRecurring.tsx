import { Box, MenuList, Stack, Typography } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Checkbox, Select } from "components/shared";
import { NS_BUDGETING } from "constant/index";
import { Option } from "constant/types";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ModalAddRecurring = ({ open, onClose }: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);

  const templateSelectData: Option[] = [
    { label: "Select 1", value: "select1" },
    { label: "Select 2", value: "select2" },
    { label: "Select 3", value: "select3" },
  ];

  const sxInput = {
    height: 58,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  };

  return (
    <FormLayout
      label={budgetT("dialogRecurring.titleModalAdd")}
      pending={false}
      submitWhenEnter={false}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialogRecurring.cancelBtnText")}
      submitText={budgetT("dialogRecurring.addBtnText")}
    >
      <Stack overflow="auto">
        <Box py={2}>
          <MenuList component={Stack} spacing={2}>
            <Select
              options={templateSelectData}
              title={budgetT("dialogRecurring.recurringInterval")}
              name="recurringInterval"
              rootSx={sxInput}
              fullWidth
              value=""
            />
            <Stack gap={2} direction="row">
              <Box width="50%">
                <Select
                  options={templateSelectData}
                  title={budgetT("dialogRecurring.nextOccurrence")}
                  name="nextOccurrence"
                  rootSx={sxInput}
                  fullWidth
                  value=""
                />
              </Box>
              <Box width="50%">
                <Select
                  options={templateSelectData}
                  title={budgetT("dialogRecurring.stopRecurring")}
                  name="stopRecurring"
                  rootSx={sxInput}
                  fullWidth
                  value=""
                />
              </Box>
            </Stack>
            <Stack direction="row">
              <Checkbox id="copyPoNumber" />
              <Typography
                component="label"
                htmlFor="copyPoNumber"
                ml={1}
                sx={{ cursor: "pointer" }}
              >
                Copy PO number on each occurence
              </Typography>
            </Stack>
          </MenuList>
        </Box>
      </Stack>
    </FormLayout>
  );
};
