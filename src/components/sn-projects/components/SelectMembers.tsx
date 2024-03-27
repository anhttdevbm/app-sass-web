import { MouseEvent, memo, useEffect, useId, useMemo, useState } from "react";
import { MenuList, Popover, Stack, popoverClasses } from "@mui/material";
import { IconButton, Text } from "components/shared";
import CircleCloseIcon from "icons/CircleCloseIcon";
import ChevronIcon from "icons/ChevronIcon";
import { useEmployeeOptions } from "store/company/selectors";
import { Member } from "./helpers";
import MemberItem from "./MemberItem";
import { usePositionOptions } from "store/global/selectors";
import { NS_PROJECT, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import { Search } from "components/Filters";

type SelectMembersProps = {
  value?: Member[];
  name: string;
  onChange: (name: string, data: Member[]) => void;
  ignoreId?: string;
};

const SelectMembers = (props: SelectMembersProps) => {
  const { name, value: members = [], onChange, ignoreId } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const {
    items,
    filters,
    onGetOptions: onGetEmployeeOptions,
  } = useEmployeeOptions();
  const { onGetOptions } = usePositionOptions();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const ignoreItems = useMemo(() => {
    if (!ignoreId) return items;
    return items.filter((item) => item.id !== ignoreId);
  }, [ignoreId, items]);

  const ignoreMembers = useMemo(() => {
    if (!ignoreId) return members;
    return members.filter((item) => item.id !== ignoreId);
  }, [ignoreId, members]);

  const onOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    onGetEmployeeOptions({ pageIndex: 1, pageSize: 20 });
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetEmployeeOptions({ pageIndex: 1, pageSize: 20, [name]: newValue });
  };

  const onRemoveMember = (id: string) => {
    const newData = [...members];
    const indexSelected = members.findIndex((item) => item.id === id);
    if (indexSelected !== -1) {
      newData.splice(indexSelected, 1);
    }
    onChange(name, newData);
  };

  const onChangeMembers = (id: string, fullname: string) => {
    const indexSelected = members.findIndex((item) => item.id === id);

    const newData = [...members];
    if (indexSelected === -1) {
      newData.push({ id, fullname });
    } else {
      newData.splice(indexSelected, 1);
    }
    onChange(name, newData);
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 200000 });
  }, [onGetOptions]);

  return (
    <>
      <Stack
        direction="row"
        py={1}
        px={2.5}
        bgcolor="grey.50"
        justifyContent="space-between"
        onClick={onOpen}
        minHeight={56}
        borderRadius={1}
        sx={{ cursor: "pointer" }}
      >
        <Stack flex={1} spacing={0.5}>
          <Text variant="caption" color="grey.300">
            {projectT("list.form.title.members")}
          </Text>
          <Stack
            direction="row"
            rowGap={1.5}
            columnGap={1.5}
            flex={1}
            flexWrap="wrap"
          >
            {ignoreMembers?.map((member) => (
              <DisplayItem
                key={member.id}
                {...member}
                onRemove={onRemoveMember}
              />
            ))}
          </Stack>
        </Stack>

        <ChevronIcon
          sx={{ color: "grey.400", fontSize: 16, alignSelf: "center" }}
        />
      </Stack>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
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
            width: anchorEl?.offsetWidth ?? 200,
            maxHeight: 350,
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.100",
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
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
        <Stack p={2}>
          <Search
            name="email"
            value={filters?.email}
            placeholder={commonT("searchBy", { name: "email" })}
            onChange={onChangeSearch}
            emitWhenEnter
          />
          <MenuList component={Stack} spacing={2}>
            {ignoreItems.map((item) => {
              const isChecked = members.some((member) => item.id === member.id);
              return (
                <MemberItem
                  key={item.id}
                  {...item}
                  onChange={onChangeMembers}
                  checked={isChecked}
                />
              );
            })}
          </MenuList>
        </Stack>
      </Popover>
    </>
  );
};

export default memo(SelectMembers);

const DisplayItem = (
  props: Member & {
    onRemove: (id: string) => void;
  },
) => {
  const { fullname, id, onRemove } = props;

  const { isDarkMode } = useTheme();

  const onRemoveMember = (event) => {
    event.stopPropagation();
    onRemove(id);
  };

  return (
    <Stack
      direction="row"
      py={0.25}
      px={0.5}
      borderRadius={5}
      bgcolor={isDarkMode ? "background.default" : "primary.light"}
      spacing={1}
      display="inline-flex"
      width="fit-content"
    >
      <Text variant="body2" maxWidth={150} noWrap tooltip={fullname}>
        {fullname}
      </Text>
      <IconButton noPadding onClick={onRemoveMember}>
        <CircleCloseIcon sx={{ color: "grey.400" }} />
      </IconButton>
    </Stack>
  );
};