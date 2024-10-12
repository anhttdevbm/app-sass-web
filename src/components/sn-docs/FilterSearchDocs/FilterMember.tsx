/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  Popover,
  Stack,
  Typography,
  popoverClasses,
} from "@mui/material";
import { Search } from "components/Filters";
import { Checkbox, Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMembers } from "store/company/actions";
import { MemberListSelect } from "./components";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { filterTextStyles, sxConfig } from "./styles";
import Avatar from "components/Avatar";

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
  // id: string;
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

export type ISelectMember = {
  id: string;
  fullname: string;
  avatar: string;
};

const FilterMember = ({ onChange }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [members, setMembers] = useState<IMember[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedMember, setSelectedMember] = useState<ISelectMember[]>([]);
  const [searchQueries, setSearchQueries] = useState("");

  const onChangeSearch = async (name: string, newValue?: string | number) => {
    const newPageIndex = 0;
    setMembers([]);
    setPageIndex(newPageIndex);
    setHasMore(true);
    const queries = { page: newPageIndex, [name]: newValue };
    const queryString = transformQueries(queries);
    setSearchQueries(queryString);
    await fetchMember({ page: newPageIndex, query: queryString });
  };

  const transformQueries = (queries: Record<string, any>): string => {
    const conditions: string[] = [];

    for (const [key, value] of Object.entries(queries)) {
      if (key !== "page" && value !== undefined && value !== "") {
        if (typeof value === "string") {
          conditions.push(`like(${key},"${value}")`);
        } else if (typeof value === "number") {
          conditions.push(`eq(${key},${value})`);
        }
      }
    }

    if (conditions.length === 0) {
      return "";
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    return `and(${conditions.join(",")})`;
  };

  const onChangeMembers = (id: string, fullname: string, avatar: string) => {
    setSelectedMember((pre) => {
      const idIndex = pre.findIndex((item) => item.id === id);
      const newSelected = [...pre];
      if (idIndex !== -1) {
        newSelected.splice(idIndex, 1);
      } else newSelected.push({ id, fullname, avatar });
      const newIds = newSelected.map((item) => item.id).join(",");

      onChange({
        user_id: newIds,
      });
      return newSelected;
    });
  };

  const clearSelectedMembers = () => {
    setSelectedMember([]);
    onChange({
      user_id: "",
    });
  };

  const fetchMember = async (queries?: any) => {
    let params = {
      page: pageIndex,
      query: searchQueries,
    };

    params = { ...params, ...queries };

    const res = await getMembers(params);
    if (res) {
      if (params.page >= res.total_page) {
        setHasMore(false);
      }
      setMembers((prevMembers) => [...prevMembers, ...res.data]);
      setTotalPages(res.total_page);
      setPageIndex((prevPageIndex) => params.page + 1);
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
        <Text
          sx={{
            ...filterTextStyles,
            opacity: 0.5,
          }}
        >
          {docsT("filter.filter.creator")}:
        </Text>
        {selectedMember.length === 1 ? (
          <Box
            sx={{
              pr: "40px",
              display: "flex",
              alignItems: "center",
              gap: "1px",
            }}
          >
            <Avatar
              size={18}
              src={selectedMember[0].avatar}
              alt={selectedMember[0].fullname}
            />
            <Text sx={filterTextStyles}>{selectedMember[0].fullname}</Text>
          </Box>
        ) : (
          <Text
            sx={{
              ...filterTextStyles,
              pr: "40px",
            }}
          >
            {selectedMember.length === 0 ? docsT("filter.all") : "..."}
          </Text>
        )}
        <Box
          sx={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: "0.2px",
            borderStyle: "solid",
            borderColor: "#5C5C5C",
            borderRadius: "100%",
            pointerEvents: "none",
          }}
        >
          <ChevronIcon />
        </Box>
      </MenuItem>
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
          horizontal: "left",
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
            hasClear
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
            <MenuItem key={"all"} sx={{ height: "100%", width: "100%" }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  cursor: "pointer",
                }}
                onClick={clearSelectedMembers}
              >
                <Checkbox checked={selectedMember.length === 0} />
                <Typography>All</Typography>
              </Stack>
            </MenuItem>
            {members.map((item) => (
              <MemberListSelect
                onChangeMember={onChangeMembers}
                key={item.id}
                member={item}
                checked={
                  selectedMember.findIndex((i) => i.id === item.id) !== -1
                }
              />
            ))}
          </InfiniteScroll>
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterMember);
