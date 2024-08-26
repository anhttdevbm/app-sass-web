"use client";

import PlusIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import {
  ButtonGradiant,
  Filter,
  SearchInput,
} from "components/sn-invoice/components";
import { INVOICE_CREATE_PATH } from "constant/paths";
import useQueryParams from "hooks/useQueryParams";
import DeleteInvoiceIcon from "icons/DeleteInvoiceIcon";
import { usePathname, useRouter } from "next-intl/client";
import { useEffect, useState } from "react";
import { useBudgets } from "store/billing/selectors";
import { useEmployeeOptions } from "store/company/selectors";
import { getPath } from "utils/index";

export interface FilterType {
  key: string;
  value: string;
}

const Actions = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [filter, setFilter] = useState<FilterType[]>([]);
  const { items: creatorList, onGetOptions } = useEmployeeOptions();
  const { query } = useQueryParams();
  const { budgets, onGetBudgets } = useBudgets();
  const pathname = usePathname();
  const { push } = useRouter();

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

    const updatedQueries = { ...query, [filter.key]: filter.value };
    const updatedPath = getPath(pathname, updatedQueries);

    push(updatedPath);
  };
  useEffect(() => {
    onGetOptions({ pageIndex: 0, pageSize: 10 });
    onGetBudgets({ pageIndex: 0, pageSize: 10 });
  }, []);

  const handleClickAdd = (e) => {
    e.preventDefault();
    push(INVOICE_CREATE_PATH);
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
        <ButtonGradiant onClick={handleClickAdd} startIcon={<PlusIcon />}>
          Add
        </ButtonGradiant>
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
                { label: "All", value: "" },
                ...(budgets ?? []).map((budget) => ({
                  label: budget?.name,
                  value: budget?.id,
                })),
              ],
            },
            {
              name: "Creator",
              options: [
                { label: "All", value: "" },
                ...(creatorList ?? []).map((creator) => ({
                  label: creator?.fullname,
                  value: creator?.id,
                })),
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
            fontWeight: "700",
          }}
          startIcon={<DeleteInvoiceIcon />}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default Actions;
