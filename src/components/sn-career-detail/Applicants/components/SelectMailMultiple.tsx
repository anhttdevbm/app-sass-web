import React, { memo, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Autocomplete, SxProps, MenuItem, Stack, Chip } from "@mui/material";
import { Input, Text } from "components/shared";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { MailData } from "store/feedback/actions";
import useTheme from "hooks/useTheme";

type SelectTagProps = {
  items: MailData[]; 
  onOpen?: () => void;
  onEnded?: () => void;
  sx?: any; // Replace 'any' with the actual type
  error?: boolean;
  label?: string;
  onEnter?: (value: string | undefined) => void;
  onSelect?: (event: React.ChangeEvent<{}>, value: any) => void;
  value?: MailData[]; // Update the type
};

const SelectMailMultiple: React.FC<SelectTagProps> = ({
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

  const getOptionLabel = (option: MailData) => option.mail || ''; // Specify the property to be used as the label

  const renderOption = (props: any, option: MailData) => {
    return (
      <MenuItem {...props} value={option} key={option.mail}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="body2">{option.mail}</Text>
        </Stack>
      </MenuItem>
    );
  };

  const renderTags = (value: MailData[], getTagProps: any) => {
    const mailIds = value.map((mail) => mail.mail);
    
    return mailIds.map((mailId, index) => {
      const mail = items.find((item) => item.mail === mailId);
      if (!mail) {
        return null; 
      }
      const { key, ...rest } = getTagProps({ index });
      return (
        <Chip
          label={mail.mail}
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
      onEnded={onEnded}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <Input
          rootSx={{
            ...sx,
            cursor: "pointer",
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
      isOptionEqualToValue={(option, value) => option.mail === value.mail}
      onChange={onSelect}
      value={value}
    />
  );
};

export default SelectMailMultiple;
