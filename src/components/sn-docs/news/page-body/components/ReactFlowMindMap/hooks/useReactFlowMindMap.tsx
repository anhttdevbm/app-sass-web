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
import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlowBoxCustom from "../components/ReactFlowBoxCustom";

const initialNodes: Node[] = [
  {
    id: "node-1",
    data: { value: "Hello  Summer" },
    position: { x: 0, y: 0 },
    type: "typeReactFlowBoxCustom",
  },
  {
    id: "node-2",
    data: { value: "Hello  Autumn" },
    position: { x: 350, y: 0 },
    type: "typeReactFlowBoxCustom",
  },
];
const initialEdges: Edge[] = [
  {
    id: "node-1-to-node-2",
    source: "node-1",
    target: "node-2",
    type: "step",
  },
];

const useReactFlowMindMap = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const updateNodeData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nodeId: string, newData: any) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node,
        ),
      );
    },
    [],
  );

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
          updateNodeData={updateNodeData}
          handleAddNode={handleAddNode}
        />
      ),
    }),
    [updateNodeData, handleAddNode],
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
