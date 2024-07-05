import React, { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import { Box, MenuList, Popover, popoverClasses, Stack } from "@mui/material";
import { Text } from "components/shared";
import ChevronIcon from "../../../../icons/ChevronIcon";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import FilterOwner from "components/sn-project-detail/Budget/Actions/FilterOwner";
import FilterDate from "components/sn-project-detail/Budget/Actions/FilterDate";

export type TFilterSearchProps = {
  queries: Params;
  onChange: (name: string, value: any) => void;
};

const Filter = ({ onChange, queries }: TFilterSearchProps) => {
  const projectT = useTranslations(NS_PROJECT);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const isHasValue =
    queries?.user_id ||
    queries?.project ||
    queries?.lastEdit ||
    queries?.project_status;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: "grey.400",
          fontWeight: 600,
          height: 32,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <Text color={"gray.400"} fontWeight={600} fontSize={"14px"}>
          {projectT("budget.titleFilter")}
        </Text>
        <Box
          sx={{
            color: isHasValue ? "primary.main" : "grey.400",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronIcon fontSize="small"></ChevronIcon>
        </Box>
      </Box>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 150,
            maxWidth: 150,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
            },
          },
        }}
      >
        <Stack
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <MenuList component={Box} sx={{ py: 1 }}>
            <FilterOwner queries={queries} onChange={onChange} />
            <FilterDate queries={queries} onChange={onChange} />
          </MenuList>
        </Stack>
      </Popover>
    </>
  );
};

export default memo(Filter);
