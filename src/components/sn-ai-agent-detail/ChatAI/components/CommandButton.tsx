import { Button, Stack } from "@mui/material";
import { Text } from "components/shared";

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

export const CommandButton = ({
  icon,
  label,
  description,
  onClick,
}: CommandButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={icon}
      onClick={onClick}
      fullWidth
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "primary.main",
        width: "calc(50% - 8px)",
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "background.default",
          boxShadow: "none",
        },
        justifyContent: "flex-start",
        padding: "16px",
      }}
    >
      <Stack
        direction="column"
        alignItems="flex-start"
        spacing={"2px"}
        justifyContent={"flex-start"}
      >
        <Text
          variant={"h6"}
          color={"grey.400"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "120px",
          }}
        >
          {label}
        </Text>
        <Text
          fontSize={"12px"}
          fontWeight={400}
          color={"grey.400"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "120px",
          }}
        >
          {description}
        </Text>
      </Stack>
    </Button>
  );
};
