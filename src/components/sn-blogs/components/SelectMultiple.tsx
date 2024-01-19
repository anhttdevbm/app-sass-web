import React, { memo, SyntheticEvent } from "react";
import { Autocomplete, SxProps, MenuItem, Stack, Chip } from "@mui/material";
import { Input, Text } from "components/shared";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { uuid } from "utils/index";
import { TagData } from "store/blog/actions";

interface IProps {
    label: string;
    options: Array<TagData>;
    limitTags?: number;
    onSelect: (
        event: SyntheticEvent<Element, Event>,
        value: Array<TagData>,
    ) => void;
    loading?: boolean;
    onEndReached?: () => void;
    sx?: SxProps;
    error?: string;
    value?: TagData;
    onEnter?: (value: string | undefined) => void;
    onOpen?: () => void;
    onInputChange?: (value: string) => void;
}

const ID_PLACEHOLDER = uuid();

const SelectMultiple = ({
    limitTags = 3,
    options,
    label,
    onEnter,
    onSelect,
    sx,
    onEndReached,
    error,
    onInputChange,
    onOpen,
    loading = true,
}: IProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
        <Autocomplete
        getOptionLabel={(option) => option.tag || ''}
        multiple
        fullWidth
        onOpen={() => onOpen && onOpen()}
        onEnded={onEndReached}
        limitTags={limitTags}
        renderInput={(params) => (
          <Input
            rootSx={{
              ...sx,
              cursor: 'pointer',
              height: 56,
              marginTop: 0.5,
            }}
            inputRef={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onEnter && onEnter(inputRef.current?.value);
              }
            }}
            error={error}
            {...params}
            title={label}
            placeholder="--"
          />
        )}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            sx={{
              display: option.tag === ID_PLACEHOLDER ? 'none' : undefined,
            }}
            key={option.tag}
            value={option.tag}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {option.tag !== ID_PLACEHOLDER && (
                <Stack>
                  <Text variant="body2" className="text-option">
                    {option.tag}
                  </Text>
                </Stack>
              )}
            </Stack>
          </MenuItem>
        )}
        popupIcon={
          <ArrowDownIcon
            sx={{
              transform: 'rotate(270deg)',
              width: '14px',
              height:'14px'
            }}
            color="inherit"
          />
        }
        renderTags={(value, getTagProps) => (
          value.map((option, index) => (
            <Chip
              label={option.tag}
              {...getTagProps({ index })}
              key={getTagProps({ index }).key}
              size="small"
              sx={{
                color: 'black',
                mt: 2,
                mb:1,
                backgroundColor: ({ palette }) => palette?.primary.light,
              }}
            />
          ))
        )}
        loading={loading}
        options={options}
        onInputChange={(event, value) => onInputChange && onInputChange(value)}
        isOptionEqualToValue={(option, value) => option.tag === value.tag}
        onChange={(event, value) => onSelect(event, value)}
      />
    );
  };
  
  export default memo(SelectMultiple);

const defaultSx = {
    item: {
        color: "text.primary",
        backgroundColor: "grey.50",
        "&:hover": {
            backgroundColor: "primary.main",
            "& svg": {
                color: "common.white",
            },
        },
    },
};
