import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    MarkerType,
  } from "@xyflow/react";
  import { useCallback, useEffect, useMemo, useState } from "react";
  import ReactFlowBoxCustom from "../components/ReactFlowBoxCustom";
  import { useAppSelector } from "store/hooks";
  
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
    const [oldIdNode, setOldIdNode] = useState<string>();
    const [oldPositionNode, setOldPositionNode] = useState(0);
    const verMindMap = useAppSelector((state) => state.doc.mindMap.version);
  
    const updateNodeData = useCallback((nodeId: string, newData: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeId) {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                value: newData,
              },
            };
            return updatedNode;
          }
          return node;
        }),
      );
    }, []);
  
    const handleAddNode = useCallback(
      (idParent: string, isAddSession?: boolean, position?: string) => {
        setOldIdNode(idParent);
        const isHasConnect = edges.some((item) => item.source === idParent);
        const parentNode = nodes.find((node) => node.id === idParent);
        if (!parentNode) return;
  
        /*start  update new position y of new node */
        let newY = parentNode.position.y;
  
        if (oldIdNode === idParent && isHasConnect && verMindMap === "mindmap") {
          // If the parent is the same as the last time, add 80 to the y-position
          newY = oldPositionNode + 80;
        } else if (isAddSession && verMindMap === "mindmap") {
          newY = oldPositionNode + 80;
        } else if (verMindMap === "chart" && position === "left") {
          newY = nodes[1].position.y;
        } else if (verMindMap === "chart" && position === "right") {
          newY = nodes[1].position.y;
        } else if (verMindMap === "chart") {
          newY = oldPositionNode + 120;
        } else {
          newY = parentNode.position.y;
        }
        /*end  update new position y of new node */
  
        /*start  update new position x of new node */
        let newX = parentNode.position.x;
        if (verMindMap === "mindmap") {
          newX = parentNode.position.x + 350;
        } else if (verMindMap === "chart" && position === "left") {
          newX = nodes[1].position.x - 350;
        } else if (verMindMap === "chart" && position === "right") {
          newX = nodes[1].position.x + 350;
        } else {
          newX = parentNode.position.x;
        }
        /*end  update new position x of new node */
  
        const newNodeId = `node-${nodes.length + 1}`;
  
        setNodes((prevNodes) => [
          ...prevNodes,
          {
            id: newNodeId,
            data: { value: "New Node" },
            position: {
              x: newX,
              y: newY,
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
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "#14B9E5",
            },
            style: {
              strokeWidth: 2,
              stroke: "#14B9E5",
            },
          },
        ]);
  
        setOldIdNode(undefined);
        setOldPositionNode(newY);
      },
      [edges, nodes, oldIdNode, oldPositionNode, verMindMap],
    );
  
    const handeDeleteNode = useCallback(
      (idParent: string) => {
        const deleteChildrenNodes = (nodeId: string) => {
          const childEdges = edges.filter((edge) => edge.source === nodeId);
  
          childEdges.forEach((edge) => {
            deleteChildrenNodes(edge.target);
          });
  
          setEdges((prevEdges) =>
            prevEdges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId,
            ),
          );
  
          if (nodeId !== idParent) {
            setNodes((prevNodes) =>
              prevNodes.filter((node) => node.id !== nodeId),
            );
          }
        };
  
        const childEdges = edges.filter((edge) => edge.source === idParent);
        childEdges.forEach((edge) => {
          deleteChildrenNodes(edge.target);
        });
  
        // Reset oldPositionNode and oldIdNode after deleting children
        setOldPositionNode(0);
        setOldIdNode(idParent);
      },
      [edges],
    );
  
    const nodeTypes = useMemo(
      () => ({
        typeReactFlowBoxCustom: (props) => (
          <ReactFlowBoxCustom
            {...props}
            data={{
              value: props.data?.value || "",
              isAddSession: props.data.isAddSession,
            }} // Ensure there's always a value prop
            updateNodeData={updateNodeData}
            handleAddNode={handleAddNode}
            handleDeleteNode={handeDeleteNode}
            edges={edges}
            nodes={nodes}
          />
        ),
      }),
      [edges, handeDeleteNode, handleAddNode, nodes, updateNodeData],
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
  