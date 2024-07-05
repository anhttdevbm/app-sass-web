import { MouseEvent, memo, useEffect, useId, useMemo, useState } from "react";
import { MenuList, Popover, Stack, popoverClasses } from "@mui/material";
import { Text } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import TypeProjectItem from "./TypeProjectItem";
import { NS_PROJECT, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import { Search } from "components/Filters";
import {
  usePositionOptions,
  useProjectTypeOptions,
} from "store/global/selectors";
import { Option } from "constant/types";
import { useProjectTypes } from "store/company/selectors";

type SelectTypeProjectProps = {
  onChange: (data: Option) => void;
  value: { value: string | number, label: string }
};

const SelectTypeProject = (props: SelectTypeProjectProps) => {
  const { onChange, value: selectedValue } = props
  const { onCreateProjectType } = useProjectTypes();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();

  const {
    isFetching: projectTypeOptionsIsFetching,
    totalPages: projectTypeOptionsTotalPages,
    pageIndex: projectTypeOptionsPageIndex,
    options: projectTypeOptions,
    onGetOptions: onGetProjectTypeOptions,
    pageSize: projectTypeOptionsPageSize,
  } = useProjectTypeOptions();

  useEffect(() => {
    onGetProjectTypeOptions({ pageSize: 500000 });
  }, [onGetProjectTypeOptions]);

  const { onGetOptions } = usePositionOptions();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const onOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    onGetProjectTypeOptions({ pageIndex: 1, pageSize: 500000 });
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  const [searchValue, setSearchValue] = useState('')

  const onChangeSearch = (name: string, value?: string) => {
    if(!value?.trim()) return
    setSearchValue(value)
  };

  const filterOptions = projectTypeOptions.filter(item => item.label.includes(searchValue))

  const onChangeTypeProject = (value: string | number, label: string) => {
    onChange({ value, label });
    setSearchValue('')
    onClose()
  };

  const handleAddingNewType = async () => {
    const result = await onCreateProjectType({ name: searchValue })
    const newType = { value: result.id, label: result.name }
    onChange(newType);

    setSearchValue('')
    onClose()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddingNewType()
    }
  };

  return (
    <Stack>
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
        className='hellsssssso'
      >
        <Stack flex={1} spacing={0.5} className='hellobbbb'>
          <Text variant="caption" color="grey.300">
            {projectT("list.form.title.projectType")}
          </Text>
          <Stack
            direction="row"
            rowGap={1.5}
            columnGap={1.5}
            flex={1}
            flexWrap="wrap"
            marginTop='0 !important'
          >
            {selectedValue?.value && <DisplayItem {...selectedValue} />}
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
            name="type"
            value={searchValue}
            placeholder={commonT("searchBy", { name: projectT("list.form.title.projectType") })}
            onChange={onChangeSearch}
            onKeyDown={handleKeyDown}
          />
          <MenuList component={Stack} spacing={2}>
            {filterOptions.map((item, index) => {
              const isChecked = filterOptions.some((item) => item.value === selectedValue?.value);
              return (
                <TypeProjectItem
                  key={item.value}
                  {...item}
                  onChange={onChangeTypeProject}
                  checked={isChecked}
                />
              );
            })}
            {!filterOptions.length && (
              <div style={{ textAlign: "center", cursor: "pointer" }}>
                <p style={{ color: "black" }}>
                  This types of project does not exits
                </p>
                <div
                  style={{
                    color: "#0bb79f",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={handleAddingNewType}
                >
                  + Add to new project type
                </div>
              </div>
            )}
          </MenuList>
        </Stack>
      </Popover>
    </Stack>
  );
};

export default memo(SelectTypeProject);

const DisplayItem = (
  props: {
    value: string | number;
    label: string
  },
) => {
  const { value, label } = props;

  const { isDarkMode } = useTheme();

  return (
    <Stack
      direction="row"
      px={0.5}
      marginTop={'0'}
      className='hello'
    >
      <Text className='hello123' variant="body2" maxWidth={150} noWrap tooltip={label}>
        {label}
      </Text>
    </Stack>
  );
};
