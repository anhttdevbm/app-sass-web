import { Autocomplete, SxProps, MenuItem, Stack, Chip, useTheme } from "@mui/material";
import { Input, Text } from "components/shared";
import ArrowDownIcon from "icons/ArrowDownIcon";
import React from "react";
import { CategoryBlogData } from "store/blog-category/reducer";

type CustomAutocompleteProps = {
  items: CategoryBlogData[]; // Replace 'any' with the actual type of your items
  onOpen?: () => void;
  onEnded?: () => void;
  sx?: any; // Replace 'any' with the actual type
  error?: boolean;
  label?: string;
  onEnter?: (value: string | undefined) => void;
  onSelect?: (event: React.ChangeEvent<{}>, value: any) => void;
};

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  items,
  onOpen,
  onEnded,
  sx,
  label,
  onEnter,
  onSelect,
}) => {
  const { palette } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const getOptionLabel = (option) => option.name; // Specify the property to be used as the label

  const renderOption = (props: any, option: any) => {
    return (
      <MenuItem {...props} value={option.id} key={option.id}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="body2">{option.name}</Text>
        </Stack>
      </MenuItem>
    );
  };

  const renderTags = (value: any, getTagProps: any) => {
    return value.map((option: any, index: number) => {
      const { key, ...rest } = getTagProps({ index });
      return (
        <Chip
          label={option.name}
          {...rest}
          key={key}
          size="small"
          sx={{
            color: "black",
            mt: 2,
            mb:1,
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
      getOptionLabel={getOptionLabel} // Define getOptionLabel to specify the property
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
            height:'14px'
          }}
          color="inherit"
        />
      }
      renderTags={renderTags}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={onSelect}
    />
  );
};

export default CustomAutocomplete;