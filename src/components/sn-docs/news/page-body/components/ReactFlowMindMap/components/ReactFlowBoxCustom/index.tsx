import { Box, Input } from "@mui/material";
import { Edge, Handle, Position, Node } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import HoverIconAddReactFlow from "../HoverIconAddReactFlow";
import HoverIconDeleteReactFlow from "../HoverIconDeleteReactFlow";
import ButtonAddSession from "../ButtonAddSession";
import { useAppSelector } from "store/hooks";
import HoverIconAddRightLeftChart from "../HoverIconAddRightLeftChart";

interface ReactFlowBoxCustomProps {
  data: { value: string; isAddSession: boolean };
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateNodeData?: (nodeId: string, newData: any) => void;
  handleAddNode: (
    idParent: string,
    isAddSession?: boolean,
    position?: string,
  ) => void;
  handleDeleteNode: (idParent: string) => void;
  edges: Edge[];
  nodes: Node[];
}

export default function ReactFlowBoxCustom({
  data,
  id,
  updateNodeData,
  handleAddNode,
  handleDeleteNode,
  edges,
  nodes,
  ...props
}: ReactFlowBoxCustomProps) {
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isHasConnect, setIsHasConnect] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const verMindMap = useAppSelector((state) => state.doc.mindMap.version);

  const getParentId = (nodeId: string, edges: Edge[]) => {
    const parentEdge = edges.find((edge) => edge.target === nodeId);
    return parentEdge ? parentEdge.source : null;
  };

  const parentId = getParentId(id, edges);

  const isNodeTwo = useMemo(() => {
    return !!(nodes && nodes[1] && id === nodes[1].id);
  }, [nodes, id]);

  /* start get last node of parent */
  const getLastTargetsNode = (nodes: Node[], edges: Edge[]) => {
    const sourceTargets = {};
    edges.forEach((edge) => {
      if (
        !sourceTargets[edge.source] ||
        edge.target > sourceTargets[edge.source]
      ) {
        sourceTargets[edge.source] = edge.target;
      }
    });
    return new Set(Object.values(sourceTargets));
  };

  const lastTargets = getLastTargetsNode(nodes, edges);
  const isLastTargets = lastTargets.has(id);
  /* end get last node of parent */

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value || "Empty"; // Default to "Empty" if value is empty
    if (updateNodeData) updateNodeData(id, newValue);
  };

  const handleCheckConnect = useCallback(() => {
    const isHasConnect = edges.some((item) => item.source === id);
    if (isHasConnect) {
      setIsHasConnect(true);
      setIsShowAdd(false);
    } else {
      setIsHasConnect(false);
      setIsShowDelete(false);
    }
  }, [edges, id]);

  useEffect(() => {
    handleCheckConnect();
  }, [handleCheckConnect]);

  return (
    <Box
      onMouseEnter={() => {
        if (!isHasConnect) {
          setIsShowAdd(true);
        } else {
          setIsShowDelete(true);
        }
      }}
      onMouseLeave={() => {
        if (!isHasConnect) {
          // setIsShowAdd(false);
        } else {
          setIsShowDelete(false);
        }
      }}
      sx={{
        display: "flex",
        position: "relative",
        paddingRight: verMindMap === "mindmap" ? "22px" : "0px",
        marginBottom: verMindMap === "mindmap" ? "0px" : "22px",
        alignItems: "center",
        justifyContent: verMindMap === "chart" ? "center" : undefined,
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
        {verMindMap === "mindmap" ? (
          <>
            <Handle type="source" position={Position.Right} id={id + "right"} />
            <Handle type="target" position={Position.Left} id={id + "left"} />
          </>
        ) : (
          <>
            <Handle
              type="source"
              position={Position.Bottom}
              id={id + "right"}
            />
            <Handle type="target" position={Position.Top} id={id + "left"} />
          </>
        )}
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

      {isShowAdd && isNodeTwo && verMindMap === "chart" ? (
        <HoverIconAddRightLeftChart
          onClickIcon={() => {
            if (parentId) {
              handleAddNode(parentId, undefined, "left");
            } else {
              console.error("error");
            }
          }}
          positionIcon="left"
        />
      ) : null}
      {isShowAdd && isNodeTwo && verMindMap === "chart" ? (
        <HoverIconAddRightLeftChart
          onClickIcon={() => {
            if (parentId) {
              handleAddNode(parentId, undefined, "right");
            } else {
              console.error("error");
            }
          }}
          positionIcon="right"
        />
      ) : null}
      {isShowDelete ? (
        <HoverIconDeleteReactFlow onClickIcon={() => handleDeleteNode(id)} />
      ) : null}
      {isLastTargets && verMindMap === "mindmap" ? (
        <ButtonAddSession
          onAddSession={() => {
            if (parentId) {
              handleAddNode(parentId, true);
            } else {
              console.error("error");
            }
          }}
        />
      ) : null}
      {verMindMap === "chart" ? (
        <div
          style={{
            position: "absolute",
            bottom: "-45%",
            height: "20px",
            width: "100%",
          }}
        ></div>
      ) : null}
    </Box>
  );
}