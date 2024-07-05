"use client";

import {
  ButtonBase,
  MenuItem,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import { SelectMembers } from "components/sn-projects/components";
import { TFilterSearchProps } from "components/sn-project-detail/Budget/Actions/Filter";
import { useMembersOfProject } from "store/project/selectors";
import { Member } from "store/project/reducer";

const FilterOwner = ({ onChange, queries }: TFilterSearchProps) => {
  const projectT = useTranslations(NS_PROJECT);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [valueSelectedOwner, setValueSelectedOwner] = useState<Member[]>([]);
  const { items: members } = useMembersOfProject();
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (members.length === 0) return;
    if (
      typeof queries?.user_id === "object" &&
      Array.isArray(queries.user_id)
    ) {
      setValueSelectedOwner(queries.user_id);
      return;
    }
    if (typeof queries?.user_id !== "string") {
      return;
    }
    const userIds = queries.user_id.split(",");
    const ownerSearch: Member[] = [];
    for (const userId of userIds) {
      members.map((member) => {
        if (member.id === userId) {
          ownerSearch.push(member);
        }
      });
    }
    setValueSelectedOwner(ownerSearch);
  }, [members, queries]);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={{
          width: "100%",
          py: 1,
          px: 2,
        }}
      >
        <Text variant="body2" color="grey.400">
          {projectT("budget.filter.owner")}
        </Text>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 270,
            maxWidth: 270,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
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
          <SelectMembers
            name="user_id"
            value={valueSelectedOwner}
            onChange={onChange}
          />
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterOwner);
