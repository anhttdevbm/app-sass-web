import { Box, Stack, TableRow, Typography } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import ActionsCell from "components/sn-ai-agent/components/ActionCell";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import SyncIcon from "icons/SyncIcon";
import TrashIcon from "icons/TrashIcon";
import { useAIAgent } from "store/aiAgent/selectors";
import { Knowledge, StatusKnowledge, TypeKnowledge } from "store/aiAgent/types";

export const TableKnowledge = () => {
  const t = useTranslations(NS_AI_AGENT);

  const { listKnowledge , onDeleteSource, aiAgent, onResyncSource} = useAIAgent();

  const [data, setData] = useState<Knowledge[]>([]);

  const tableHeaders: CellProps[] = useMemo(
    () => [
      { value: t("knowledge.agent"), width: "45%", align: "left" },
      { value: t("knowledge.status"), width: "20%", align: "center" },
      { value: t("knowledge.type"), width: "20%", align: "center" },
      { value: "", width: "15%", align: "right" },
    ],
    [],
  );

  const handleResync = (knowledgeId: string) => {
    onResyncSource(knowledgeId);
  }

  const handleDelete = (knowledgeId: string) => {
    if (aiAgent) {
      onDeleteSource({ agentId: aiAgent.id, knowledgeId });
    }
  };

  useEffect(() => {
    setData(listKnowledge);
  }, [listKnowledge]);

  return (
   <>
     {data.length > 0 && (
       <TableLayout
         headerList={tableHeaders}
         noData={data.length === 0}
         height={"100%"}
         maxHeight={"300px"}
       >
         {data.map((knowledge, index) => (
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
               {knowledge.name}
             </BodyCell>
             <BodyCell>
               <Box
                 display={"flex"}
                 width={"100%"}
                 alignItems={"center"}
                 justifyContent={"center"}
               >
                 <Stack
                   width={"81px"}
                   height={"26px"}
                   borderRadius={"6px"}
                   padding={"10px"}
                   gap={"10px"}
                   bgcolor={knowledge.status === StatusKnowledge.READY ? "#E8F2EF" : "#ECECF3"}
                   alignItems={"center"}
                   justifyContent={"center"}
                 >
                   <Typography
                     fontSize={"12px"}
                     fontWeight={600}
                     color={knowledge.status === StatusKnowledge.READY ? "#0BB783" : "#666666"}
                   >
                     {knowledge.status.charAt(0).toUpperCase() + knowledge.status.slice(1).toLowerCase()}</Typography>
                 </Stack>
               </Box>
             </BodyCell>
             <BodyCell>{knowledge.type.charAt(0).toUpperCase() + knowledge.type.slice(1).toLowerCase()}</BodyCell>
             <ActionsCell
               sx={{
                 width: "190px",
                 textAlign: "right",
               }}
               options={[
                 ...(knowledge.type === TypeKnowledge.LINK || knowledge.type === TypeKnowledge.YOUTUBE ? [
                    {
                      icon: <SyncIcon fontSize="medium" />,
                      content: t("knowledge.resync"),
                      onClick: () => handleResync(knowledge.id),
                    },
                  ] : []),
                 {
                   icon: <TrashIcon color="error" fontSize="medium" />,
                   content: t("knowledge.remove"),
                   color: "error.main",
                   onClick: () => handleDelete(knowledge.id),
                 },
               ]}
             />
           </TableRow>
         ))}
       </TableLayout>
     )}
   </>
  );
};
