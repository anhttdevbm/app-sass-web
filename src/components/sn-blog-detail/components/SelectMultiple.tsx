import React, { memo, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Autocomplete, SxProps, MenuItem, Stack, Chip } from "@mui/material";
import { Input, Text } from "components/shared";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { TagData } from "store/blog/actions";

// Import necessary libraries and components

const ID_PLACEHOLDER = 'your-uuid-placeholder';

interface SelectMultipleProps {
  limitTags?: number;
  options: TagData[];
  label: string;
  onSelect: (event: SyntheticEvent<Element, Event>, value: TagData[]) => void;
  loading?: boolean;
  onEndReached?: () => void;
  sx?: SxProps;
  error?: string;
  value?: TagData[];
  onEnter?: (value: string | undefined) => void;
  onOpen?: () => void;
  onInputChange?: (value: string) => void;
}

const defaultSx = {
  item: {
    color: 'text.primary',
    backgroundColor: 'grey.50',
    '&:hover': {
      backgroundColor: 'primary.main',
      '& svg': {
        color: 'common.white',
      },
    },
  },
};

const SelectMultiple: React.FC<SelectMultipleProps> = ({
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
  value = [],
}: SelectMultipleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedValues, setSelectedValues] = useState<TagData[]>([]);
  const selectedOptions = options.filter((option) =>
    value.some((selectedOption) => selectedOption.tag === option.tag)
  );
  useEffect(() => {
    setSelectedValues(selectedOptions);
  }, [selectedOptions]);
  return (
    <>
      <Autocomplete
        getOptionLabel={(option) => option?.tag || ''}
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
              ...defaultSx.item,
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
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.tag}
              {...getTagProps({ index })}
              key={getTagProps({ index }).key}
              size="small"
              sx={{
                color: 'black',
                mt: 2,
                mb: 1,
                backgroundColor: ({ palette }) => palette?.primary.light,
              }}
            />
          ))
        }
        loading={loading}
        options={options}
        onInputChange={(event, value) => onInputChange && onInputChange(value)}
        isOptionEqualToValue={(option, value) => option.tag === value.tag}
        onChange={(event, selectedOptions) => {
          setSelectedValues(selectedOptions as TagData[]);
          onSelect(event, selectedOptions as TagData[]);
        }}
        value={selectedValues}
      />
    </>
  );
};

export default memo(SelectMultiple);
