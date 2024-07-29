import { Option } from "constant/types";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { FilterType } from "components/sn-invoice/Actions";
import DropdownCircleIcon from "../../../icons/DropdownCircleIcon";

export interface ItemFilter {
  name: string;
  options: Option[];
}

interface FilterProps {
  filters: ItemFilter[];
  onFilter: (filter: FilterType) => void;
}

export const Filter = ({ filters, onFilter }: FilterProps) => {
  const handleOnChangeOption = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filter: ItemFilter,
  ) => {
    onFilter({
      key: filter.name,
      value: e.target.value,
    });
  };

  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      <Typography fontSize={"14px"} fontWeight={500} color={"#4D4D4D"}>
        View by:
      </Typography>
      {filters.map((filter) => (
        <Stack
          key={filter.name}
          direction={"row"}
          bgcolor={"#fff"}
          border={"1px solid #EFEFEF"}
          padding={"12px 30px"}
          borderRadius={"100px"}
        >
          <Stack direction={"row"} position="relative">
            <span>
              <Typography
                marginRight={1}
                fontSize={"16px"}
                fontWeight={400}
                color={"#00000080"}
              >
                {filter.name}:
              </Typography>
            </span>
            <select
              onChange={(e) => handleOnChangeOption(e, filter)}
              style={{
                appearance: "none",
                border: "none",
                outline: "none",
                borderRadius: "4px",
                width: "100%",
                cursor: "pointer",
                fontSize: "16px",
                paddingRight: "30px",
              }}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <DropdownCircleIcon
              style={{
                position: "absolute",
                right: "0px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
