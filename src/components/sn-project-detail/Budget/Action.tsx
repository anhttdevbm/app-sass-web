import { memo } from "react";
import { Stack } from "@mui/material";
import AddBudget from "./Actions/AddBudget";
import { SearchWithOnlyInput } from "./Actions/Search";

const Action = ({ projectId }: { projectId?: string }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={3}
      py={{ xs: 1.5, md: 1, lg: 1.5 }}
      px={{ xs: 0, md: 3 }}
      display={{ xs: "none", md: "flex" }}
    >
      <AddBudget projectId={projectId} />
      <SearchWithOnlyInput />
    </Stack>
  );
};

export default memo(Action);
