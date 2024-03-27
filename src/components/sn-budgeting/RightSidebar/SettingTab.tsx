import { Box, InputAdornment, OutlinedInput, Stack } from "@mui/material";
import { Text } from "components/shared";
import { PopperItem, PopperMenu } from "components/shared/PopperMenu";
import DropDownIcon from "icons/DropDownIcon";
import DuplicateIcon from "icons/DuplicateIcon";
import TrashIcon from "icons/TrashIcon";
import { useState } from "react";
import { TBudget, TBudgetCreateParam } from "store/project/budget/action";
import { useBudgets } from "store/project/budget/selector";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { getMessageErrorByAPI, formatDate } from "utils/index";
import { DATE_FORMAT_FORM, NS_COMMON, NS_PROJECT } from "constant/index";
import ConfirmDialog from "components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { BUDGETING_PATH } from "constant/paths";

interface SettingTabProps {
  budget: TBudget;
}
export const SettingTab = ({ budget }: SettingTabProps) => {
  const { owner, project, start_date, end_date, name } = budget;
  const [restrictionEl, setRestrictionEl] = useState<HTMLElement | null>(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false)

  const { onAddSnackbar } = useSnackbar();
  const router = useRouter()
  const projectBudget = useBudgets();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  
  const handleDuplicate = async () => {
    const param: TBudgetCreateParam = {
      project_id: project.id,
      start_date: formatDate(start_date, DATE_FORMAT_FORM),
      end_date: formatDate(end_date, DATE_FORMAT_FORM),
      owner: owner.id,
      name
    } as TBudgetCreateParam;

    try {
      await projectBudget.create(param);
      onAddSnackbar(projectT("budget.duplicateBudgetSuccess"), "success");
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const handleDelete = async () => {
    try {
      await projectBudget.delete(project.id);
      onAddSnackbar(projectT("budget.deleteBudgetSuccess"), "success");
      setIsConfirmDelete(false)
      router.push(BUDGETING_PATH)
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  }

  return (
    <>
      <Box mt={3}>
        <Stack mb={3} gap={1}>
          <Text fontWeight="bold" sx={{ fontSize: "18px", color: "black" }}>
            Time warning
          </Text>
          <Text>
            {owner?.fullname} will get a warning when worked hours reach this
            percentage of estimated hours
          </Text>
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment
                position="end"
                sx={{ "& .MuiTypography-root": { color: "black" } }}
              >
                kg
              </InputAdornment>
            }
            sx={{
              width: "100%",
              bgcolor: "grey.50",
              "& fieldset": { border: 0 },
            }}
          />
        </Stack>
        <Stack mb={3} gap={1}>
          <Text fontWeight="bold" sx={{ fontSize: "18px", color: "black" }}>
            Tracking type
          </Text>
          <Text>
            Depending on the type of tracking you choose people will be able to
            track on all services, services that have the same service type that
            is assigned to them or services that are assigned directly to them.
          </Text>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              bgcolor: "grey.50",
              borderRadius: "7px",
              p: "16.5px 14px",
              cursor: "pointer",
              mb: 2,
            }}
            onClick={(e) =>
              setRestrictionEl(restrictionEl ? null : e.currentTarget)
            }
          >
            <Text>No restriction</Text>
            <DropDownIcon sx={{ fontSize: "28px", color: "grey.400" }} />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              color: "black",
              cursor: "pointer",
              py: 1,
            }}
            onClick={handleDuplicate}
          >
            <DuplicateIcon sx={{ fontSize: "24px", fontWeight: "bold" }} />
            <Text
              ml={1}
              sx={{ color: "black", fontSize: "18px", fontWeight: "bold" }}
            >
              Dupicate
            </Text>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              color: "error.main",
              cursor: "pointer",
              py: 1,
            }}
            onClick={() => setIsConfirmDelete(true)}
          >
            <TrashIcon sx={{ fontSize: "24px", fontWeight: "bold" }} />
            <Text
              ml={1}
              sx={{ color: "error.main", fontSize: "18px", fontWeight: "bold" }}
            >
              Delete
            </Text>
          </Stack>
        </Stack>
        <PopperMenu
          anchorEl={restrictionEl}
          setAnchorEl={setRestrictionEl}
          placement="bottom"
          
        >
          <PopperItem>No restriction</PopperItem>
          <PopperItem>Restricted by person</PopperItem>
          <PopperItem>Restricted by service type</PopperItem>
        </PopperMenu>
      </Box>

      <ConfirmDialog
          onSubmit={handleDelete}
          open={isConfirmDelete}
          onClose={() => setIsConfirmDelete(false)}
          title={commonT("confirmDelete.title")}
          content={commonT("confirmDelete.content")}
        />
    </>
  );
};
