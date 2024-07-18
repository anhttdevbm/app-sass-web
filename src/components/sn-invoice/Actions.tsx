"use client";

import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import TrashIcon from "icons/TrashIcon";
import {
  ButtonGradiant,
  Filter,
  SearchInput,
} from "components/sn-invoice/components";
import { useState } from "react";
import PlusIcon from "@mui/icons-material/Add";

export interface FilterType {
  key: string;
  value: string;
}

const Actions = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [filter, setFilter] = useState<FilterType[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchKey(value);
  };

  const handleFilterChange = (filter: FilterType) => {
    setFilter((prev) => {
      const index = prev.findIndex((f) => f.key === filter.key);
      if (index !== -1) {
        prev[index] = filter;
        return [...prev];
      }
      return [...prev, filter];
    });
  };

  return (
    <Stack spacing={1} padding={2}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchInput
          value={searchKey}
          placeholder={"Search here"}
          onChange={handleSearchChange}
        />
        <ButtonGradiant startIcon={<PlusIcon />}>Add</ButtonGradiant>
      </Stack>
      <Stack
        paddingX={4}
        paddingY={1}
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        border={"1px solid #EFEFEF"}
        borderRadius={"100px"}
        sx={{
          background: "#F7F7FD",
        }}
      >
        <Filter
          filters={[
            {
              name: "Budget",
              options: [
                { label: "All", value: "all" },
                { label: "Paid", value: "paid" },
                { label: "Unpaid", value: "unpaid" },
              ],
            },
            {
              name: "Creator",
              options: [
                { label: "All", value: "all" },
                { label: "Paid", value: "paid" },
                { label: "Unpaid", value: "unpaid" },
              ],
            },
          ]}
          onFilter={handleFilterChange}
        />
      </Stack>
      <Stack maxWidth={"100px"}>
        <Button
          variant="outlined"
          color="error"
          sx={{
            borderRadius: "8px",
            border: "0.6px solid #D5D5D5",
            textTransform: "capitalize",
          }}
          startIcon={<TrashIcon />}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default Actions;
