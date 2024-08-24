import { Box, Stack, Typography } from "@mui/material"
import React, { ComponentProps } from "react";
import { BoxOwnProps } from "@mui/system/Box/Box"
import { Theme } from "@mui/system/createTheme/createTheme"

interface Props extends BoxOwnProps<Theme> {
  title: string
  data: string
  bgColor: string
  cornerIcon: React.ReactNode
  description?: React.ReactNode
}

function StatOverviewCard({
  title,
  data,
  bgColor,
  cornerIcon,
  description,
  ...rest
}: Props) {
  return (
    <Box
      flexGrow={1}
      flexBasis={1}
      padding={2.5}
      height={162}
      borderRadius={1.5}
      sx={{
        backgroundColor: bgColor,
        width: "auto",
        boxShadow: "0px 6px 20px -4px rgba(0, 0, 0, 0.08)",
      }}
      {...(rest as ComponentProps<typeof Box>)}
    >
      <Stack justifyContent="space-between" sx={{ height: "100%" }}>
        <Stack spacing={0.5}>
          <Typography fontSize={13} fontWeight={500}>
            {title}
          </Typography>
          <Typography fontSize={24} fontWeight={600}>
            {data}
          </Typography>
          {description}
        </Stack>
        <Stack alignItems="end">{cornerIcon}</Stack>
      </Stack>
    </Box>
  );
}

export default StatOverviewCard
