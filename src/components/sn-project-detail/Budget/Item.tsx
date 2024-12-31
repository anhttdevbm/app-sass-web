import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Box, Stack } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { PopperItem, PopperMenu } from "components/shared/PopperMenu";
import { DATE_TIME_FORMAT_SLASH, DEFAULT_PAGING } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import MoreDotIcon from "icons/MoreDotIcon";
import { memo, useEffect, useState } from "react";
import { TBudgetListQueries, TBudgets } from "store/project/budget/action";
import { useBudgets } from "store/project/budget/selector";
import { useMembersOfProject } from "store/project/selectors";
import { formatDate } from "utils/index";
import { ItemWithProject } from "./Items/ItemWithProject";
import { ItemWithoutProject } from "./Items/ItemWithoutProject";

const Item = ({ projectId }: { projectId?: string }) => {
  const [budgets, setBudgets] = useState<TBudgets>([]);
  const [idSelecteds, setIdSelected] = useState<string[]>([]);
  const [subsidiaryEl, setSubsidiaryEl] = useState<HTMLElement | null>(null);
  const [statusEl, setStatusEl] = useState<HTMLElement | null>(null);
  const [tagEl, setTagEl] = useState<HTMLElement | null>(null);
  const [moreEl, setMoreEl] = useState<HTMLElement | null>(null);

  const { items: budgetItems, get: getBudget } = useBudgets();

  const { items: members } = useMembersOfProject();

  const { isReady, query: queryParam } = useQueryParams();

  useEffect(() => {
    if (!isReady) return;
    console.log("budgets", budgets);


    const query: TBudgetListQueries = {
      ...DEFAULT_PAGING,
      ...queryParam,
    };

    if (projectId) {
      query.project_id = projectId;
    }

    getBudget(query);
  }, [isReady, getBudget, queryParam]);

  useEffect(() => {
    if (!budgetItems || !members || budgetItems.length == 0) return;
    const newBudgetData: TBudgets = [];
    budgetItems.map((budget) => {
      budget = { ...budget };
      budget.created_time = formatDate(
        budget.created_time,
        DATE_TIME_FORMAT_SLASH,
      );
      budget.start_date = formatDate(budget.start_date, DATE_TIME_FORMAT_SLASH);
      budget.end_date = formatDate(budget.end_date, DATE_TIME_FORMAT_SLASH);
      newBudgetData.push(budget);
    });
    setBudgets(newBudgetData);
  }, [budgetItems, members]);

  return (
    <Box px={{ xs: 0, md: 3 }}>
      {idSelecteds.length > 0 && (
        <Stack
          direction="row"
          px={2}
          py={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: "#D9F0FD" }}
        >
          <Stack direction="row" alignItems="center">
            <Text>
              <span style={{ color: "#0575E6" }}>{idSelecteds.length}</span>
              &nbsp;selected&nbsp;
              {idSelecteds.length > 1 ? "items" : "item"}
            </Text>
            {/*<IconButton sx={{ ml: 1 }} onClick={() => setIdSelected([])}>*/}
            {/*  <CloseIcon />*/}
            {/*</IconButton>*/}
          </Stack>
          <Stack direction="row" gap={2}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", color: "grey.400" }}
              onClick={(e) =>
                setSubsidiaryEl(subsidiaryEl ? null : e.currentTarget)
              }
            >
              <Text>Subsidiary</Text>
              <KeyboardArrowDownIcon />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", color: "grey.400" }}
              onClick={(e) => setStatusEl(statusEl ? null : e.currentTarget)}
            >
              <Text>Status</Text>
              <KeyboardArrowDownIcon />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", color: "grey.400" }}
              onClick={(e) => setTagEl(tagEl ? null : e.currentTarget)}
            >
              <SellOutlinedIcon
                sx={{ transform: "rotate(75deg)", fontSize: "20px", mr: 1 }}
              />
              <Text>Tags</Text>
              <KeyboardArrowDownIcon />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", color: "grey.400" }}
              onClick={(e) => setMoreEl(moreEl ? null : e.currentTarget)}
            >
              <IconButton>
                <MoreDotIcon fontSize="medium" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      )}
      {projectId ? (
        <ItemWithProject
          budgets={budgets}
          idSelecteds={idSelecteds}
          setIdSelected={setIdSelected}
        />
      ) : (
        <ItemWithoutProject
          budgets={budgets}
          idSelecteds={idSelecteds}
          setIdSelected={setIdSelected}
        />
      )}
      <PopperMenu anchorEl={subsidiaryEl} setAnchorEl={setSubsidiaryEl}>
        <PopperItem>Subsidiary 1</PopperItem>
        <PopperItem>Subsidiary 2</PopperItem>
      </PopperMenu>
      <PopperMenu anchorEl={statusEl} setAnchorEl={setStatusEl}>
        <PopperItem>Status 1</PopperItem>
        <PopperItem>Status 2</PopperItem>
      </PopperMenu>
      <PopperMenu anchorEl={tagEl} setAnchorEl={setTagEl}>
        <PopperItem>Tags 1</PopperItem>
        <PopperItem>Tags 2</PopperItem>
      </PopperMenu>
      <PopperMenu anchorEl={moreEl} setAnchorEl={setMoreEl}>
        <PopperItem>More 1</PopperItem>
        <PopperItem>More 2</PopperItem>
      </PopperMenu>
    </Box>
  );
};

export default memo(Item);
