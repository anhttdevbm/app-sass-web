"use client";

import { Box, Stack, TableRow, Typography } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import useQueryParams from "hooks/useQueryParams";
import { usePathname, useRouter } from "next-intl/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import styled from "styled-components";
import { getPath } from "utils/index";
import ActionsCell, { PRIMARY_GRADIENT_COLOR } from "./components/ActionCell";
import Pagination from "./components/Pagination";
import { useTranslations } from "next-intl";
import { DEFAULT_PAGING, NS_AI_AGENT } from "constant/index";
import { AI_AGENT_CHAT, AI_AGENT_GENERAL_PATH } from "constant/paths";
import Avatar from "components/Avatar";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import { AIAgent, StatusAIAgent } from "store/aiAgent/types";
import avatar from "components/Avatar";

const AgentList = () => {
  const {
    aiAgents,
    limit,
    page,
    totalAIAgents,
    totalPages,

    onGetAgents,
    onDeleteAgent,

    isDeletingAgent,
    isCreatingAgent,
    isUpdatingAgent
  } = useAIAgent();
  const { initQuery, isReady, query } = useQueryParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations(NS_AI_AGENT);

  const [data, setData] = useState<AIAgent[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQueryChange = useCallback((newQueries: { [key: string]: any }) => {
    const updatedQueries = { ...query, ...newQueries };
    const updatedPath = getPath(pathname, updatedQueries);

    push(updatedPath);
    onGetAgents(updatedQueries);
  }, [query, pathname, push, onGetAgents]);

  const handlePageChange = (newPage: number) =>
    handleQueryChange({ page: newPage, limit });

  const handleSizeChange = (newPageSize: number) =>
    handleQueryChange({ page: 1, size: newPageSize });

  const handleChat = (agentId: string) => {
    const path = getPath(AI_AGENT_CHAT, undefined, { id: agentId });
    push(path);
  }

  const handleDelete = (id: string) => {
    onDeleteAgent(id);
  }

  const handleEdit = (agentId: string) => {
    const path = getPath(AI_AGENT_GENERAL_PATH, undefined, { id: agentId });
    push(path);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
      setData(aiAgents);
  }, [aiAgents]);

  useEffect(() => {
    if (!isCreatingAgent && !isDeletingAgent && !isUpdatingAgent) {
      onGetAgents({...query });
    }
  }, [isCreatingAgent, isDeletingAgent, isUpdatingAgent]);

  useEffect(() => {
    if (!isReady) return;
    onGetAgents({ ...initQuery });
  }, [initQuery, isReady, onGetAgents]);

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

  return (
    <FixedLayout rounded="0 0 12px 12px" padding={3}>
      <TableLayout headerList={tableHeaders} noData={totalPages === 0}>
        {data.length && data.map((agent: AIAgent, index) => (
          <TableRow key={agent.id}>
            <BodyCell>{index + 1 + (page - 1) * limit}</BodyCell>
            <BodyCell
              href={getPath(AI_AGENT_GENERAL_PATH, undefined, { id: agent.id })}
              align={"left"}
              linkProps={ { sx: { display: "block"  } } }
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  size={32}
                  src={agent.avatar ?? ImgPlaceHolderAgent}
                />
                <Box width="100%">
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={600}
                    lineHeight={1.28}
                    sx={{
                      "&:hover": { color: "primary.main" },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {agent.name}
                  </Typography>
                </Box>
              </Stack>
            </BodyCell>
            <BodyCell>{formatDate(agent.created_time)}</BodyCell>
            <BodyCell>
              <Box
                display={"flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <StyledBox isActive={agent.status === StatusAIAgent.ACTIVE}>
                  <StyledDiv isActive={agent.status === StatusAIAgent.ACTIVE}>
                    {agent.status}
                  </StyledDiv>
                </StyledBox>
              </Box>
            </BodyCell>
            <ActionsCell
              onChat={() => handleChat(agent.id)}
              onEdit={() => handleEdit(agent.id)}
              onDelete={() => handleDelete(agent.id)}
            />
          </TableRow>
        ))}
      </TableLayout>
      <Pagination
        totalItems={totalPages}
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
