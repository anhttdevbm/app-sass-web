import React, { memo, SyntheticEvent } from "react";
import { Autocomplete, SxProps, MenuItem, Stack, Chip } from "@mui/material";
import { Input, Text } from "components/shared";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { uuid } from "utils/index";
import { TagData } from "store/blog/actions";
import useTheme from "hooks/useTheme";

type SelectTagProps = {
  items: TagData[]; 
  onOpen?: () => void;
  onEnded?: () => void;
  sx?: any; // Replace 'any' with the actual type
  error?: boolean;
  label?: string;
  onEnter?: (value: string | undefined) => void;
  onSelect?: (event: React.ChangeEvent<{}>, value: any) => void;
  value?: TagData[]; // Update the type
};

const SelectTagMultiple: React.FC<SelectTagProps> = ({
  items,
  onOpen,
  onEnded,
  sx,
  label,
  onEnter,
  onSelect,
  value,
}) => {
  const { palette } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const getOptionLabel = (option: TagData) => option.tag || ''; // Specify the property to be used as the label

  const renderOption = (props: any, option: TagData) => {
    return (
      <MenuItem {...props} value={option} key={option.tag}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="body2">{option.tag}</Text>
        </Stack>
      </MenuItem>
    );
  };

  const renderTags = (value: TagData[], getTagProps: any) => {
    const tagIds = value.map((tag) => tag.tag);
    
    return tagIds.map((tagId, index) => {
      const tag = items.find((item) => item.tag === tagId);
      if (!tag) {
        return null; 
      }
      const { key, ...rest } = getTagProps({ index });
      return (
        <Chip
          label={tag.tag}
          {...rest}
          key={key}
          size="small"
          sx={{
            color: "black",
            mt: 2,
            mb: 1,
            backgroundColor: palette?.primary.light,
          }}
        />
      );
    });
  };
  
  return (
    <Autocomplete
      options={items}
      multiple
      fullWidth
      limitTags={2}
      onOpen={onOpen}
      onEnded={onEnded}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <Input
          rootSx={{
            ...sx,
            cursor: "pointer",
            height: 56,
            marginTop: 0.5,
          }}
          inputRef={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter && onEnter(inputRef.current?.value);
            }
          }}
          {...params}
          title={label}
          placeholder="--"
        />
      )}
      renderOption={renderOption}
      popupIcon={
        <ArrowDownIcon
          sx={{
            transform: "rotate(270deg)",
            width: '14px',
            height: '14px',
          }}
          color="inherit"
        />
      }
      renderTags={renderTags}
      isOptionEqualToValue={(option, value) => option.tag === value.tag}
      onChange={onSelect}
      value={value}
    />
  );
};

export default SelectTagMultiple;