import { Autocomplete, SxProps, MenuItem, Stack, Chip } from "@mui/material";
import { Checkbox, IconButton, Input, Text } from "components/shared";
import useTheme from "hooks/useTheme";
import ArrowDownIcon from "icons/ArrowDownIcon";
import React, {  } from "react";
import { CategoryBlogData } from "store/blog-category/reducer";
type SelectCategoriesProps = {
  items: CategoryBlogData[]; 
  onOpen?: () => void;
  onEnded?: () => void;
  sx?: any; // Replace 'any' with the actual type
  error?: boolean;
  label?: string;
  onEnter?: (value: string | undefined) => void;
  onSelect?: (event: React.ChangeEvent<{}>, value: any) => void;
  value?: CategoryBlogData[]; // Update the type
};

const SelectCategoriescomplete: React.FC<SelectCategoriesProps> = ({
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

  const getOptionLabel = (option: CategoryBlogData) => option.name || ''; // Specify the property to be used as the label

  const renderOption = (props: any, option: CategoryBlogData) => {
    return (
      <MenuItem {...props} value={option} key={option.id}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="body2">{option.name}</Text>
        </Stack>
      </MenuItem>
    );
  };

  const renderTags = (value: CategoryBlogData[], getTagProps: any) => {
    const tagIds = value.map((tag) => tag.id);
    
    return tagIds.map((tagId, index) => {
      const tag = items.find((item) => item.id === tagId);
      if (!tag) {
        return null; 
      }
      const { key, ...rest } = getTagProps({ index });
      return (
        <Chip
          label={tag.name}
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
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={onSelect}
      value={value}
    />
  );
};

export default SelectCategoriescomplete;