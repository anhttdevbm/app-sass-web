import { TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import ActionsCell from "components/sn-ai-agent/components/ActionCell";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import SyncIcon from "icons/SyncIcon";
import TrashIcon from "icons/TrashIcon";

interface KnowledgeProps {
  ListKnowledge: {
    agent: string;
    status: string;
    type: string;
  }[];
}

export const TableKnowledge = ({ ListKnowledge }: KnowledgeProps) => {
  const t = useTranslations(NS_AI_AGENT);

  const tableHeaders: CellProps[] = useMemo(
    () => [
      { value: t("knowledge.agent"), width: "45%", align: "left" },
      { value: t("knowledge.status"), width: "20%", align: "center" },
      { value: t("knowledge.type"), width: "20%", align: "center" },
      { value: "", width: "15%", align: "right" },
    ],
    [],
  );

  const handleDelete = () => {
    console.log("delete");
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <TableLayout
        headerList={tableHeaders}
        noData={ListKnowledge.length === 0}
      >
        {ListKnowledge.map((agent, index) => (
          <TableRow key={index}>
            <BodyCell
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "90%",
                textAlign: "left",
              }}
            >
              {agent.agent}
            </BodyCell>
            <BodyCell>{agent.status}</BodyCell>
            <BodyCell>{agent.type}</BodyCell>
            <ActionsCell
              sx={{
                width: "190px",
                textAlign: "right",
              }}
              options={[
                {
                  icon: <SyncIcon fontSize="medium" />,
                  content: t("knowledge.resync"),
                  onClick: () => console.log("sync"),
                },
                {
                  icon: <TrashIcon color="error" fontSize="medium" />,
                  content: t("knowledge.remove"),
                  color: "error.main",
                  onClick: handleDelete,
                },
              ]}
            />
          </TableRow>
        ))}
      </TableLayout>
    </div>
  );
};
