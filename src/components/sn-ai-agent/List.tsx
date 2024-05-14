"use client";

import { Box, Stack, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import useQueryParams from "hooks/useQueryParams";
import { usePathname, useRouter } from "next-intl/client";
import { useEffect, useMemo } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import styled from "styled-components";
import { getPath } from "utils/index";
import ActionsCell, { PRIMARY_GRADIENT_COLOR } from "./components/ActionCell";
import Pagination from "./components/Pagination";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";
import { AI_AGENT_GENERAL_PATH, AI_AGENT_PATH } from "constant/paths";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";

const AgentList = () => {
  const { aiAgents, limit, page, totalAIAgents, totalPages, onGetAgents } =
    useAIAgent();
  const { initQuery, isReady, query } = useQueryParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations(NS_AI_AGENT);

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
      { value: t("layout.table.index"), width: "10%", align: "center" },
      { value: t("layout.table.agent"), width: "25%", align: "center" },
      { value: t("layout.table.creationDate"), width: "25%", align: "center" },
      { value: t("layout.table.status"), width: "25%", align: "center" },
      { value: "", width: "15%", align: "center" },
    ],
    [],
  );

  useEffect(() => {
    if (!isReady) return;
    onGetAgents({ ...initQuery });
  }, [initQuery, isReady, onGetAgents]);

  const handleChat = () => console.log("Chat agent");
  const handleDelete = () => console.log("Delete agent");
  const handleEdit = () => console.log("Edit agent");

  return (
    <FixedLayout rounded="0 0 12px 12px" padding={3}>
      <TableLayout headerList={tableHeaders} noData={totalAIAgents === 0}>
        {aiAgents.map((agent, index) => (
          <TableRow key={agent.id}>
            <BodyCell>{index + 1 + (page - 1) * limit}</BodyCell>
            <BodyCell
              href={getPath(AI_AGENT_GENERAL_PATH, undefined, { id: agent.id })}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  size={32}
                  src={agent.avatar?.link ?? ImgPlaceHolderAgent}
                />
                <Text
                  variant="body2"
                  color="text.primary"
                  fontWeight={600}
                  lineHeight={1.28}
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  {agent.name}
                </Text>
              </Stack>
            </BodyCell>
            <BodyCell>{agent.creationDate}</BodyCell>
            <BodyCell>
              <Box
                display={"flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <StyledBox isActive={agent.status === "Active"}>
                  <StyledDiv isActive={agent.status === "Active"}>
                    {agent.status}
                  </StyledDiv>
                </StyledBox>
              </Box>
            </BodyCell>
            <ActionsCell
              onChat={handleChat}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

const StyledBox = styled(Box)<{ isActive: boolean }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 0;
  border-radius: 6px;
  width: 81px;
  text-align: center;
  color: ${(props) => (props.isActive ? "transparent" : "#666666")};
  background-color: ${(props) => (props.isActive ? "#E8F2EF" : "#ECECF3")};
`;

const StyledDiv = styled("div")<{ isActive: boolean }>`
  ${(props) =>
    props.isActive &&
    `
    background: ${PRIMARY_GRADIENT_COLOR};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;
