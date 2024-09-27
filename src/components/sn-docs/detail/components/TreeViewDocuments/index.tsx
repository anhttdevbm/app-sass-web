import { TreeItem, TreeView } from "@mui/lab";

import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IDocItemDetail } from "../../DocDetail";
import TreeViewItem from "../TreeViewItem";
import TreeViewLabel from "../TreeViewLabel";
import "./TreeViewStyle.css";
import useLeftSlideDoc from "../../LeftSlide/hooks/useLeftSlideDoc";
import { useDispatch } from "react-redux";

export default function TreeViewDocuments({ doc }: { doc: IDocItemDetail }) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const { handleAddChild } = useLeftSlideDoc();

  const handleAddNewChildDoc = ({
    idDoc,
    projectId,
  }: {
    idDoc: string;
    projectId?: string;
  }) => {
    handleAddChild(idDoc, projectId);
  };

  if (doc)
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        <TreeItem
          nodeId={doc?.id}
          label={
            <TreeViewLabel
              dataRename={{ idDoc: doc.id, isParent: true }}
              key={doc?.id}
              labelText={doc?.name}
              handleClickTreeLabel={() => {
                handleAddNewChildDoc({
                  idDoc: doc.id,
                  projectId: doc.project_id?.id,
                });
              }}
            />
          }
        >
          {doc?.child.map((item) => (
            <TreeViewItem
              key={item.id}
              childDocItem={item}
              idDocParent={doc?.id ?? ""}
              projectId={doc?.project_id?.id ?? ""}
            />
          ))}
        </TreeItem>
      </TreeView>
    );
}
