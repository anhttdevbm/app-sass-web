import { useState } from "react";
import { IMindmapItem } from "..";
import { uuid } from "utils/index";

const mindMapParent: IMindmapItem = {
  title: "Hello Summer",
  id: uuid(),
};

const useMindmap = () => {
  const [mindMapItem, setMindmapItem] = useState<IMindmapItem>(mindMapParent);

  const handleAddChildren = () => {
    const newMindMapParent = mindMapItem;
    const newChildren = { id: uuid(), title: "", children: [] };
    if (newMindMapParent) {
      newMindMapParent.children?.push(newChildren);
      return newChildren;
    }
  };

  const getNewChild = () => {
    const newChildren = { id: uuid(), title: "", children: [] };
    return newChildren;
  };

  const handleDeleteChildren = () => {
    const newMindMapParent = mindMapItem;
    newMindMapParent.children = [];
    setMindmapItem(newMindMapParent);
  };

  const handleAddChildToChild = (idChild: string) => {
    console.log("123");
    if (!mindMapItem.children) return;
    console.log("456");
    const updatedChildren = mindMapItem.children.map((child) => {
      if (child.id === idChild) {
        const newChildren = Array(3)
          .fill(null)
          .map(() => ({
            id: uuid(),
            title: "",
            children: [],
          }));

        return {
          ...child,
          children: [...(child.children || []), ...newChildren],
        };
      }
      return child;
    });

    setMindmapItem({
      ...mindMapItem,
      children: updatedChildren,
    });
  };

  const deleteChildToChild = (idChildToDelete: string) => {
    if (!mindMapItem.children) return;

    const deleteChild = (children: IMindmapItem[]): IMindmapItem[] => {
      return children.reduce((acc: IMindmapItem[], child: IMindmapItem) => {
        if (child.id === idChildToDelete) {
          return acc;
        }

        if (child.children && child.children.length > 0) {
          return [...acc, { ...child, children: deleteChild(child.children) }];
        }

        return [...acc, child];
      }, []);
    };

    const updatedChildren = deleteChild(mindMapItem.children);

    setMindmapItem({
      ...mindMapItem,
      children: updatedChildren,
    });
  };

  return {
    setMindmapItem,
    mindMapItem,
    handleAddChildren,
    handleDeleteChildren,
    handleAddChildToChild,
    deleteChildToChild,
    getNewChild
  };
};

export default useMindmap;
