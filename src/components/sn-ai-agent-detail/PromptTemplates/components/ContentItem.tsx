import { Stack } from "@mui/material";
import { IconButton, Text } from "components/shared";
import CopyIcon from "icons/CopyIcon";
import { CopyTextIcon } from "icons/CopyTextIcon";

export interface ContentItemProps {
  id: string;
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ContentItem = ({
  id,
  title,
  description,
  isSelected,
  onClick,
}: ContentItemProps) => {
  return (
    <Stack
      padding={2}
      direction={"column"}
      bgcolor={isSelected ? "primary.light" : "background.default"}
      width={"100%"}
      borderRadius={"4px"}
      position={"relative"}
      sx={{
        cursor: "pointer",
        "&:hover": {
          bgcolor: isSelected ? "primary.light" : "grey.200",
        },
      }}
      border={"1px solid"}
      borderColor={isSelected ? "primary.main" : "transparent"}
      onClick={onClick}
    >
      <Text variant={"h6"}>{title}</Text>
      <Text fontSize={"14px"} fontWeight={400} color={"grey.400"}>
        {description}
      </Text>
      {isSelected && (
        <IconButton
          sx={{
            position: "absolute",
            right: 16,
            top: 8,
            padding: 1,
            backgroundColor: "primary.main",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <CopyTextIcon color="white" size={16} />
        </IconButton>
      )}
    </Stack>
  );
};
