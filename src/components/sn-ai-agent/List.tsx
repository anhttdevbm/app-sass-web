"use client";

import React, { useEffect, useMemo } from "react";
import { useAgents } from "store/aiAgent/selectors";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "./components/Pagination";
import { getPath } from "utils/index";
import {
  ActionsCell,
  BodyCell,
  CellProps,
  TableLayout,
} from "components/Table";
import { TableRow } from "@mui/material";
import { usePathname, useRouter } from "next-intl/client";
import FixedLayout from "components/FixedLayout";

const AgentList = () => {
  const { aiAgents, limit, page, totalAIAgents, totalPages, onGetAgents } =
    useAgents();
  const { initQuery, isReady, query } = useQueryParams();
  const { push } = useRouter();
  const pathname = usePathname();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQueryChange = (newQueries: { [key: string]: any }) => {
    const updatedQueries = { ...query, ...newQueries };
    const updatedPath = getPath(pathname, updatedQueries);

    push(updatedPath);
    onGetAgents(updatedQueries);
  };

  const handlePageChange = (newPage: number) =>
    handleQueryChange({ page: newPage, limit });
  const handleSizeChange = (newPageSize: number) =>
    handleQueryChange({ page: 1, size: newPageSize });

  const tableHeaders: CellProps[] = useMemo(
    () => [
      { value: "STT", width: "10%", align: "center" },
      { value: "Agent", width: "25%", align: "center" },
      { value: "Creation date", width: "25%", align: "center" },
      { value: "Status", width: "25%", align: "center" },
      { value: "", width: "15%", align: "center" },
    ],
    [],
  );

  useEffect(() => {
    if (!isReady) return;
    onGetAgents({ ...initQuery });
  }, [initQuery, isReady, onGetAgents]);

  const handleDelete = () => console.log("Delete agent");
  const handleEdit = () => console.log("Edit agent");

  return (
    <FixedLayout rounded="0 0 12px 12px" padding={3}>
      <TableLayout headerList={tableHeaders} noData={totalAIAgents === 0}>
        {aiAgents.map((agent, index) => (
          <TableRow key={agent.id}>
            <BodyCell>{index + 1 + (page - 1) * limit}</BodyCell>
            <BodyCell>{agent.name}</BodyCell>
            <BodyCell>{agent.creationDate}</BodyCell>
            <BodyCell>{agent.status}</BodyCell>
            <ActionsCell onEdit={handleEdit} onDelete={handleDelete} />
          </TableRow>
        ))}
      </TableLayout>
      <Pagination
        totalItems={totalAIAgents}
        totalPages={totalPages}
        page={page}
        pageSize={limit}
        onChangePage={handlePageChange}
        onChangeSize={handleSizeChange}
        containerProps={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row-reverse",
        }}
      />
    </FixedLayout>
  );
};

export default AgentList;
