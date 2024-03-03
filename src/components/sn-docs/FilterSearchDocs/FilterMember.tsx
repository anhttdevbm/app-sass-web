/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  FormControl,
  InputLabel,
  MenuItem,
  MenuList,
  Popover,
  Select,
  Stack,
  popoverClasses,
} from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { FilterSearchDocsProps, sxConfig } from "./FilterSearchDocs";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_DOCS } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { Search } from "components/Filters";
import MemberItem from "components/sn-projects/components/MemberItem";
import { useEmployeeOptions } from "store/company/selectors";
import { usePositionOptions } from "store/global/selectors";
import { useSearchParams } from "next/navigation";

const FilterMember = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const {
    items,
    filters,
    onGetOptions: onGetEmployeeOptions,
  } = useEmployeeOptions();
  const { onGetOptions } = usePositionOptions();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [members, setMembers] = useState<any>([]);
  //const [name, setName] = useState<any>([]);
  const ignoreItems = useMemo(() => {
    return items;
  }, [items]);
  const onChangeMembers = (id: string, fullname: string) => {
    const indexSelected = members.findIndex((item) => item.id === id);

    const newData = [...members];
    if (indexSelected === -1) {
      newData.push({ id, fullname });
    } else {
      newData.splice(indexSelected, 1);
    }
    setMembers(newData);
    onChange("user_id", newData);
  };
  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetEmployeeOptions({ pageIndex: 1, pageSize: 10, [name]: newValue });
  };

  const [selectedOptions, setSelectedOptions] = useState<any>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    let selectedMemberIds =
      searchParams
        .get("user_id")
        ?.split(",")
        .map((item) => {
          return {
            id: item,
            name: undefined,
          };
        }) || [];
    setMembers(selectedMemberIds);
  }, [ignoreItems, searchParams.get("user_id")]);

  const fetchUser = () => {
    const params = {
      pageIndex: 1,
      pageSize: 10,
    };
    onGetEmployeeOptions({ ...params });
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 10 });
  }, [onGetOptions]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {docsT("filter.filter.creator")}
        </Text>
        <ChevronIcon fontSize="small"></ChevronIcon>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
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
          <Search
            name="email"
            value={filters?.email}
            //placeholder={commonT("searchBy", { name: "email" })}
            onEnter={onChangeSearch}
            emitWhenEnter
          />
          {ignoreItems.map((item) => {
            const isChecked = members.some((member) => item.id === member.id);
            return (
              <MenuItem key={item.id}>
                <MemberItem
                  {...item}
                  onChange={onChangeMembers}
                  checked={isChecked}
                />
              </MenuItem>
            );
          })}
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterMember);
