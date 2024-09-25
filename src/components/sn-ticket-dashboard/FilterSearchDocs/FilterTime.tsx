/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonBase,
  MenuItem,
  Popover,
  Stack,
  popoverClasses
} from "@mui/material";
import { Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { FilterSearchDocsProps, sxConfig } from "./FilterSearchDocs";

const FillterPriority = ({ onChange, queries }: FilterSearchDocsProps) => {
  const t = useTranslations(NS_TICKET);

const ignoreItems = ["All","Last 7 Days" , "This Month" , "This Year" , "Custom"];
const [name , setName] = useState("All")
const [anchorEl, setAnchorEl] = useState<any>(null);
const handleClose = () => {
  setAnchorEl(null);
};

const onChangeMembers = (id: string, priority: string) => {
  setName(priority)
  const newData = { id, priority };

  onChange("priority", newData);
  handleClose()

};

  return (
    <>
      <MenuItem
        sx={sxConfig.item}
        component={ButtonBase}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Text variant="body2" color="grey.400">
          Duration
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
            minWidth: "fit-content",
            maxWidth: "fit-content",
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
          {ignoreItems.map((item , index) => {
            return (
              <Stack
                key={index} // Add a unique "key" prop
                onClick={()=>onChangeMembers(String(index) , String(item))}
                padding={2} textAlign={"left"}
                sx={{cursor:"pointer" ,
                  '&:hover': {
                    backgroundColor: '#f0f0f0', 
                  },
                }}
              >
                  <Text >{item}</Text>
              </Stack>
            );
          })}
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FillterPriority);
