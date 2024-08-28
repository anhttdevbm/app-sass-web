/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Select,
  Stack,
  TextField,
  popoverClasses,
} from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { FilterSearchDocsProps, sxConfig } from "./FilterSearchDocs";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_DOCS, NS_TICKET } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import useGetListAgent from "queries/ticket-agent/useGetAgent/useGetListAgent";

const FilterAssign = ({ onChange, queries }: FilterSearchDocsProps) => {
  const t = useTranslations(NS_TICKET);
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data: listAgent } = useGetListAgent();
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("All");

  const onChangeMembers = (id: string, fullname: string) => {
    setName(fullname);
    const newData = { id, fullname };
    onChange("assingn", newData);
    handleClose();
  };

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {t("ticketFields.assignedTo")}:
        </Text>
        <Text variant="body2" fontWeight={600} color="grey.700">
          {name}
        </Text>
        <ChevronIcon fontSize="small"></ChevronIcon>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 270,
            maxWidth: 270,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <TextField
            placeholder="Search assign"
            onChange={(event) => setKeyword(event.target.value)}
            sx={{
              fontSize: 3,
              height: "auto",
              outline: "none",
              padding: "0 3px",
              "& .MuiInputBase-input": {
                fontSize: "0.75rem",
              },
              "& .MuiInputBase-input::placeholder": {
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            variant="outlined"
          />
          <Box
            onClick={() => onChangeMembers("", "All")}
            display="flex"
            alignItems="center"
            gap="5px"
            padding="10px 20px"
            sx={{
              "&:hover": {
                backgroundColor: "#D9F0FD",
                cursor: "pointer",
                borderRadius: "5px",
              },
            }}
          >
            <Text sx={{ fontSize: 13, fontWeight: 700 }}>{"All"}</Text>
          </Box>
          {listAgent?.data?.data
            ?.filter((item) =>
              item?.detail?.fullname
                ?.toLowerCase()
                .includes(keyword.toLowerCase()),
            )
            .map((item: any, index: number) => (
              <Box
                key={index}
                onClick={() =>
                  onChangeMembers(item?.detail?.id, item?.detail?.fullname)
                }
                display="flex"
                alignItems="center"
                gap="5px"
                padding="10px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#D9F0FD",
                    cursor: "pointer",
                    borderRadius: "5px",
                  },
                }}
              >
                <Box
                  component="img"
                  height="30px"
                  width="30px"
                  src={
                    item?.detail?.urlAvatar
                      ? item?.detail?.urlAvatar
                      : "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"
                  }
                  alt="Image description"
                  sx={{ borderRadius: "100%" }}
                />
                <Text sx={{ fontSize: 13 }}>{item?.detail?.fullname}</Text>
              </Box>
            ))}
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterAssign);
