import { Box, selectClasses, Theme } from "@mui/material";
import { Text } from "components/shared";
import { Dropdown as SharedDropdown } from "components/Filters";

const Dropdown = ({
  ...props
}: React.ComponentProps<typeof SharedDropdown> & {
  prefixLabel: string;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid lightgray",
        borderRadius: "2rem",
        display: "flex",
        alignItems: "baseline",
        gap: 1,
        px: 2,
        py: 1,
      }}
    >
      <Text sx={{ color: "gray", fontSize: 14 }}>{props.prefixLabel}:</Text>
      <SharedDropdown
        {...props}
        hasAll
        rootSx={{
          px: "0px!important",
          [`& .${selectClasses.outlined}`]: {
            pr: "0!important",
            mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
              `${spacing(4)}!important`,
            "& .sub": {
              display: "none",
            },
          },
        }}
      />
    </Box>
  );
};

export default Dropdown;
