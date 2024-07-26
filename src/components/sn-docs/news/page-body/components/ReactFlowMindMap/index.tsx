import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useReactFlowMindMap from "./hooks/useReactFlowMindMap";

export default function ReactFlowMindMap() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes } =
    useReactFlowMindMap();

  return (
    <div style={{ height: "100%" }}>
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
