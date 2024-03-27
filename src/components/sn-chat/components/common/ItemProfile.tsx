import { Box, Typography } from "@mui/material";
import ArrowDownIcon from "icons/ArrowDownIcon";

const ItemProfile = ({
  Icon,
  title,
  onClick,
}: {
  Icon: React.ElementType;
  title: string;
  onClick: () => void;
}) => {
  return (
    <Box
      display="flex"
      gap="1rem"
      ml="1rem"
      mr="1.5rem"
      alignItems="center"
      sx={{
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Icon
        sx={{
          fill: "none",
          color: "#666666",
          filter: "opacity(0.8)",
        }}
      />
      <Typography>{title}</Typography>
      <ArrowDownIcon
        sx={{
          ml: "auto",
          transform: "rotate(180deg)",
          filter: "opacity(0.5)",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

export default ItemProfile;
