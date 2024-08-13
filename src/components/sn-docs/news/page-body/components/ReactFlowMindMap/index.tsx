import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useReactFlowMindMap from "./hooks/useReactFlowMindMap";
import useBreakpoint from "hooks/useBreakpoint";

export default function ReactFlowMindMap() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes } =
    useReactFlowMindMap();

  const { isSmSmaller } = useBreakpoint();

  return (
    <div style={{ height: isSmSmaller ? "150px" : "312px" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      ></ReactFlow>
    </div>
  );
}
