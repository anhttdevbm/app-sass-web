import { Box, Input } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import { useCallback, useState } from "react";
import HoverIconAddReactFlow from "../HoverIconAddReactFlow";

interface ReactFlowBoxCustomProps {
  data: { value: string };
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateNodeData: (nodeId: string, newData: any) => void;
  handleAddNode: (idParent: string) => void;
}

export default function ReactFlowBoxCustom({
  data,
  id,
  updateNodeData,
  handleAddNode,
}: ReactFlowBoxCustomProps) {
  const [isShowAdd, setIsShowAdd] = useState(false);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { value: evt.target.value });
    },
    [id, updateNodeData],
  );
  return (
    <Box
      onMouseEnter={() => setIsShowAdd(true)}
      onMouseLeave={() => setIsShowAdd(false)}
      sx={{
        display: "flex",
        position: "relative",
        paddingRight: "22px",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "301px",
          paddingY: 2,
          paddingX: 1,
          backgroundColor: "grey.50",
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
          position: "relative",
          "& .react-flow__handle": {
            opacity: 0,
          },
        }}
      >
        <Handle type="source" position={Position.Right} id={id + "right"} />
        <Handle type="target" position={Position.Left} id={id + "left"} />
        <Input
          value={data.value}
          disableUnderline
          onChange={onChange}
          fullWidth
        />
      </Box>
      {isShowAdd ? (
        <HoverIconAddReactFlow
          onClickIcon={() => {
            handleAddNode(id);
          }}
        />
      ) : null}
    </Box>
  );
}
