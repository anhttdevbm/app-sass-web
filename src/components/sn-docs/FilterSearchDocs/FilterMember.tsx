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
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { getMembers } from "store/company/actions";
import { MemberListSelect } from "./components";
import CircularProgress from "@mui/material/CircularProgress";

export interface IMember {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_time: string;
  status: number;
  avatar?: {
    object: string;
    name: string;
    link: string;
  };
  username: string;
  id_rocket: string;
  authToken: string;
  approve: boolean;
  company: string;
  position: {
    id: string;
    name: string;
  };
  updated_time: string;
  user_status: string;
  last_online_at: string;
}

export type ISelectMember = Pick<IMember, 'id' | 'fullname'>;

const FilterMember = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [members, setMembers] = useState<IMember[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const {
    items,
    filters,
    onGetOptions: onGetEmployeeOptions,
  } = useEmployeeOptions();

  // const { onGetOptions } = usePositionOptions();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedMember, setSelectedMember] = useState<ISelectMember>();
  // const [members, setMembers] = useState<any[]>([]);

  //const [name, setName] = useState<any>([]);
  // const ignoreItems = useMemo(() => {
  //   return items;
  // }, [items]);

  // const onChangeMembers = (id: string, fullname: string) => {
  // const indexSelected = members.findIndex((item) => item.id === id);

  // const newData = [{ id, fullname }];

  // setSelectedMember({ id, fullname });

  // if (indexSelected === -1) {
  //   newData.push({ id, fullname });
  // } else {
  //   newData.splice(indexSelected, 1);
  // }
  // setMembers(newData);
  //   onChange("user_id", newData);
  // };
  const onChangeSearch = async  (name: string, newValue?: string | number) => {
    setMembers([]);
    setPageIndex(0);
    setHasMore(true);
    const queries = { pageIndex: 1, pageSize: 10, [name]: newValue }
    await fetchMember(queries)
    // onGetEmployeeOptions({ pageIndex: 1, pageSize: 10, [name]: newValue });
  };

  // const [selectedOptions, setSelectedOptions] = useState<any>(null);

  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   const selectedMemberIds =
  //     searchParams
  //       .get("user_id")
  //       ?.split(",")
  //       .map((item) => {
  //         return {
  //           id: item,
  //           name: undefined,
  //         };
  //       }) || [];
  //   setMembers(selectedMemberIds);
  // }, [ignoreItems, searchParams.get("user_id")]);

  // const fetchUser = () => {
  //   const params = {
  //     pageIndex: 1,
  //     pageSize: 10,
  //   };
  //   onGetEmployeeOptions({ ...params });
  // };

  // useEffect(() => {
  //   onGetOptions({ pageIndex: 1, pageSize: 10 });
  // }, [onGetOptions]);

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  // const onChangeSearch = (name: string, newValue?: string | number) => {
  //   console.log('name', name)
  //   console.log('newValue', newValue)
  // }

  const onChangeMembers = (id: string, fullname: string) => {
    setSelectedMember({id: id, fullname: fullname});
  };

  const fetchMember = async (queries?: any) => {
    let params = {
      page: pageIndex,
    };
    if (queries) {
      params = queries
    }
    const res = await getMembers(params);
    if (res) {
      if (pageIndex > res.totalPages) {
        setHasMore(false);
      }
      setMembers((prevMembers) => [...prevMembers, ...res.data]);
      setTotalPages(res.totalPages);
      setPageIndex((prevPageIndex) => prevPageIndex + 1); 
    }
  };

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400" fontWeight={600}>
          {docsT("filter.filter.creator")}:
        </Text>
        <Text variant="body2" fontWeight={600} color="grey.700">
          {docsT("filter.all")}
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
            overflow: "hidden",
            minWidth: 270,
            maxWidth: 370,
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
          id="scrollableStack"
          sx={{
            position: "relative",
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
            overflow: "auto",
            width: "100%",
            maxHeight: 300,
          }}
        >
          <Search
            name="email"
            value=""
            //placeholder={commonT("searchBy", { name: "email" })}
            onEnter={onChangeSearch}
            emitWhenEnter
          />

          <InfiniteScroll
            style={{ position: "relative" }}
            dataLength={members.length}
            next={fetchMember}
            hasMore={hasMore}
            loader={undefined}
            scrollableTarget="scrollableStack"
          >
            {members.map((item) => {
              const isChecked = selectedMember?.id === item.id;
              // const isChecked = members.some((member) => item.id === member.id);
              return (
                // <MenuItem key={item.id}>
                //   <MemberItem
                //     {...item}
                //     onChange={onChangeMembers}
                //     checked={isChecked}
                //   />
                // </MenuItem>
                <MemberListSelect
                  onChangeMember={onChangeMembers}
                  key={item.id}
                  member={item}
                  checked={isChecked}
                />
              );
            })}
          </InfiniteScroll>
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterMember);
