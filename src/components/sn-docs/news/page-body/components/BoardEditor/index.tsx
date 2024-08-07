import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import BoardBoxEditor, { IDataTreeBoard } from "./components/BoardBoxEditor";
import { useCallback, useState } from "react";
import { uuid } from "utils/index";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";

const AddIcon = () => {
  return (
    <Box
      sx={{
        display: "inline-block",
        position: "relative",
        width: "24px",
        height: "24px",
      }}
    >
      <svg width="0" height="0">
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#2AF598", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#009EFD", stopOpacity: 1 }}
          />
        </linearGradient>
      </svg>
      <AddCircleSharpIcon
        sx={{
          width: "100%",
          height: "100%",
          fill: "url(#gradient1)",
        }}
      />
    </Box>
  );
};

const defaultDatta: IDataTreeBoard[] = [
  {
    id: uuid(),
    name: "Main",
    children: [
      {
        id: uuid(),
        name: "Child 1",
      },
      {
        id: uuid(),
        name: "Sub-subtree with children",
        children: [
          { id: uuid(), name: "Sub Child 1" },
          { id: uuid(), name: "Sub Child 2" },
          { id: uuid(), name: "Sub Child 3" },
        ],
      },
      {
        id: uuid(),
        name: "Child 2",
      },
    ],
  },
];

export default function BoardEditor() {
  const [boardEditorList, setBoardEditorList] =
    useState<IDataTreeBoard[]>(defaultDatta);

  const addNewTreeChildren = useCallback((id: string) => {
    setBoardEditorList((prevList) => {
      const addNewNode = (nodes: IDataTreeBoard[]): IDataTreeBoard[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              children: [
                ...(node.children || []),
                { id: uuid(), name: "New Board" },
              ],
            };
          }
          if (node.children) {
            return { ...node, children: addNewNode(node.children) };
          }
          return node;
        });
      };
      return addNewNode(prevList);
    });
  }, []);

  const handleAddNewTree = () => {
    setBoardEditorList((prevList) => [
      ...prevList,
      {
        id: uuid(),
        name: "New Session",
        children: [],
      },
    ]);
  };

  const handleNameChange = (id: string, newName: string) => {
    const updateName = (items: IDataTreeBoard[]): IDataTreeBoard[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName };
        }
        if (item.children) {
          return {
            ...item,
            children: updateName(item.children),
          };
        }
        return item;
      });
    };

    setBoardEditorList((prevData) => updateName(prevData));
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap" // Cho phép các items xuống dòng
        gap={2}
        sx={{
          width: "100%",
        }}
      >
        {boardEditorList.map((item) => (
          <BoardBoxEditor
            handleChangeName={handleNameChange}
            key={item.id}
            boardBoxItem={item}
            addNewTreeChildren={addNewTreeChildren}
          />
        ))}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingX={4}
          mt={2}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              paddingX: "21.5px",
              paddingY: "12px",
              gap: 0.5,
              borderRadius: "100px",
              border: "1px solid #2AF598",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => handleAddNewTree()}
          >
            <AddIcon />
            <Typography color="blue.normal">Add session</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
