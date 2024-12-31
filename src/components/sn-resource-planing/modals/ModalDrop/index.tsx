import { AddOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import { Select } from "components/shared";
import {
  TBudgetService,
  TBudgetServiceRes,
} from "components/sn-budgeting/BudgetDetail";
import GuideIcon from "components/sn-resource-planing/assets/GuideIcon";
import VueSaxIcon from "components/sn-resource-planing/assets/VueSaxIcon";
import { NS_RESOURCE_PLANNING } from "constant/index";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "icons/SearchIcon";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { TBudget } from "store/project/budget/action";
import { useProjects } from "store/project/selectors";
import { useGetServiceBudget } from "store/resourcePlanning/selector";

type ModalDropProps = {
  setBudgetSelected: (value: string | null) => void;
  setProjectSelected: (value: string | null) => void;
  setIsServicePopup: (value: boolean) => void;
  budgetSelected: string | null;
  projectSelected: string | null;
  isServicePopup: boolean;
};

const ModalDrop = ({
  setProjectSelected,
  setBudgetSelected,
  setIsServicePopup,
  budgetSelected,
  projectSelected,
  isServicePopup,
}: ModalDropProps) => {
  const { getBudgetsByIdProject, getServiceByBudgetQueries, setProjectId } =
    useGetServiceBudget();
  const { items } = useProjects();
  const t = useTranslations(NS_RESOURCE_PLANNING);

  const [listBudgets, setListBudgets] = useState<TBudget[] | []>([]);
  const [listServices, setListServices] = useState<TBudgetServiceRes | null>(
    null,
  );

  const [searchValue, setSearchValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  const listProjects =
    useMemo(
      () => items.map((item) => ({ value: item?.id, label: item?.name })),
      [items],
    ) || [];

  const handleChangeProject = async (projectId: string) => {
    setProjectSelected(projectId);
    setProjectId(projectId);
    const res = await getBudgetsByIdProject(projectId);

    if (res.status === 200) {
      const convertValue = res.data?.map((item: TBudgetService) => ({
        value: item.id,
        label: item.name,
      }));
      setListBudgets(convertValue);
    }
  };

  const handleSearch = async () => {
    if (budgetSelected) {
      const res = await getServiceByBudgetQueries(budgetSelected, {
        query: `or(like(name,"${searchValue}") ${dateValue
            ? `, like( createdAt,"${dayjs(dateValue).format(
              "YYYY-MM-DD:HH:mm",
            )}")`
            : ""
          })`,
      });

      if (res.status === 200) {
        setListServices(res.data);
      }
    }
  };

  return (
    <Modal
      open={isServicePopup}
      onClose={() => {
        setIsServicePopup(false);
        projectSelected && setProjectSelected(null);
        budgetSelected && setBudgetSelected(null);
        dateValue && setDateValue(dateValue);
        searchValue && setSearchValue("");
      }}
      sx={{ ".MuiBackdrop-root": { background: "transparent" } }}
    >
      <Stack
        sx={{
          position: "absolute",
          top: "180px",
          right: "70px",
          width: "316px",
          height: "fit-content",
          zIndex: "100",
          background: "white",
          borderRadius: "12px",
          color: "black",
          padding: "16px",
          maxHeight: "54vh",
          overflow: "auto",
        }}
        boxShadow={" -4px 10px 30px 0px #0000001A;"}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            font: "13px",
          }}
          display={"flex"}
          gap={1}
          alignItems={"center"}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              color: "#7A869A",
            }}
          >
            {t("popupService.project")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            options={listProjects}
            fullWidth
            value={projectSelected}
            onChange={(e) => {
              handleChangeProject(e.target.value);
            }}
            rootSx={{
              padding: 2,
              height: 36,
              background: "white",
              borderRadius: "50px",
              borderColor: " #EFEFEF",
            }}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ marginTop: "15px", font: "13px", fontWeight: "700" }}
          alignItems={"center"}
          gap={1}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              color: "#7A869A",
            }}
          >
            {t("popupService.budget")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            options={listBudgets.map(budget => ({ value: budget.id, label: budget.name }))}
            fullWidth
            placeholder={t("popupService.chooseBudgetPlacehodle")}
            rootSx={{
              padding: 2,
              height: 36,
              background: "white",
              borderRadius: "50px",
              borderColor: " #EFEFEF",
            }}
            value={budgetSelected}
            onChange={(e) => setBudgetSelected(e.target.value)}
          />
        </Stack>
        <Button
          sx={{
            height: "32px",
            background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
            margin: "15px auto",
            borderRadius: "100px",
            textTransform: "unset",
            color: "white",
          }}
          fullWidth
          onClick={handleSearch}
        >
          {t("popupService.search")}
        </Button>
        <TextField
          variant="outlined"
          placeholder={t("popupService.servicePlaceholder")}
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    width: 15,
                    height: 15,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            ".MuiInputBase-root ": {
              fontSize: 10,
              height: 28,
              border: "1px solid #EFEFEF",
              borderRadius: 100,
            },
            ".MuiInputBase-input": {
              padding: 0,
            },
          }}
        />
        <Box pt={"14px"}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography
              variant="h6"
              gutterBottom
              color={"#7A869A"}
              whiteSpace={"nowrap"}
            >
              {t("popupService.date")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <DatePicker
              value={dateValue}
              onChange={(e) => setDateValue(e)}
              sx={{
                width: "100%",
                ".MuiBox-root": {
                  padding: "5px 10px",
                },
                ".MuiTypography-root": {
                  fontSize: 10,
                },
                ".MuiOutlinedInput-notchedOutline": {
                  border: "1px solid  #EFEFEF",
                  borderRadius: 100,
                },
                ".MuiSvgIcon-root": {
                  width: 14,
                  height: 14,
                  color: "#B3B3B3",
                },
                ".MuiStack-root": {
                  width: "100%",
                  justifyContent: "space-between",
                },
                ".MuiInputBase-input": {
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#333333",
                },
              }}
              open={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              slotProps={{
                textField: {
                  onClick: () => {
                    setCalendarOpen(true);
                  },
                },
                openPickerIcon: {
                  onClick: () => {
                    setCalendarOpen(true);
                  },
                },
              }}
            />
          </Stack>
          {listServices?.result && listServices?.result?.length > 0 && (
            <Typography
              variant="subtitle1"
              gutterBottom
              fontSize={13}
              marginTop={2}
              fontWeight="bold"
            >
              <GuideIcon /> {t("popupService.dragText")}
            </Typography>
          )}
          {listServices && (
            <Typography
              variant="body1"
              color="#44546F"
              gutterBottom
              fontSize={11}
              marginTop={2}
              fontWeight={700}
              display={"flex"}
              alignItems={"center"}
              gap={"4px"}
              textTransform={"lowercase"}
            >
              <VueSaxIcon /> {listServices?.countItem}/
              {listServices?.totalService}{" "}
              {t("schedule.resourceHeader.service")}
            </Typography>
          )}

          <div
            id="external-events"
            style={{
              maxHeight: 150,
              overflow: "auto",
            }}
          >
            {listServices?.result.map((item: TBudgetService) => (
              <div key={item.id} draggable>
                <Paper
                  className="fc-event"
                  id={item.id}
                  title={item?.name}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    mb: 1,
                    borderStyle: "dashed",
                    height: "32px",
                    marginTop: "15px",
                    borderColor: "#E1D3D3",
                  }}
                >
                  <Typography fontSize={11}>{item?.name}</Typography>
                  <IconButton>
                    <AddOutlined
                      color="primary"
                      sx={{
                        background:
                          "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                        borderRadius: "100px",
                        fontSize: "16px",
                        color: "white",
                        overflow: "hidden",
                      }}
                    />
                  </IconButton>
                </Paper>
              </div>
            ))}
          </div>
        </Box>
      </Stack>
    </Modal>
  );
};

export default ModalDrop;
