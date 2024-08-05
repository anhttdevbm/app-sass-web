import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import ReactFlowBoxCustom from "../components/ReactFlowBoxCustom";

const initialNodes: Node[] = [
  {
    id: "node-1",
    data: { value: "Hello  Summer" },
    position: { x: 0, y: 0 },
    type: "typeReactFlowBoxCustom",
  },
];
const initialEdges: Edge[] = [];

const useReactFlowMindMap = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const updateNodeData = useCallback((nodeId: string, newData: string) => {
    console.log(`Updating node ${nodeId} with value: "${newData}"`);
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          console.log(`Found node to update:`, node);
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: newData,
            },
          };
          console.log(`Updated node:`, updatedNode);
          return updatedNode;
        }
        return node;
      }),
    );
  }, []);

  const handleAddNode = useCallback(
    (idParent: string) => {
      const parentNode = nodes.find((node) => node.id === idParent);
      if (!parentNode) return;

      const newNodeId = `node-${nodes.length + 1}`;

      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: newNodeId,
          data: { value: "New Node" },
          position: {
            x: parentNode.position.x + 350,
            y: 0,
          },
          type: "typeReactFlowBoxCustom",
        },
      ]);

      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `e${idParent}-${newNodeId}`,
          source: idParent,
          target: newNodeId,
        },
      ]);
    },
    [nodes],
  );

  const nodeTypes = useMemo(
    () => ({
      typeReactFlowBoxCustom: (props) => (
        <ReactFlowBoxCustom
          {...props}
          data={{ value: props.data?.value || "" }} // Ensure there's always a value prop
          // updateNodeData={updateNodeData}
          handleAddNode={handleAddNode}
        />
      ),
    }),
    [handleAddNode],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return {
    handleAddNode,
    nodes,
    setNodes,
    edges,
    setEdges,
    updateNodeData,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
  };
};

export default useReactFlowMindMap;
