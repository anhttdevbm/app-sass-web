import { IToolBarDraftActionItem } from "../..";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import PhotoIcon from "@mui/icons-material/Photo";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import GridOnIcon from '@mui/icons-material/GridOn';
import TagIcon from '@mui/icons-material/Tag';
import { Box } from "@mui/material";

const TagNameIcon = () => {
  return <Box>@</Box>;
};

export default function OtherToolBar() {
  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "insert-link",
      method: "block",
      style: "insert-link",
      icon: <InsertLinkIcon />,
    },
    {
      label: "insert-image",
      method: "block",
      style: "insert-image",
      icon: <PhotoIcon />,
    },
    {
      label: "Indent-Decrease",
      method: "block",
      style: "indent-decrease",
      icon: <TagIcon />,
    },
    {
      label: "insert-emotion",
      method: "block",
      style: "insert-emotion",
      icon: <InsertEmoticonIcon />,
    },
    {
      label: "insert-grid",
      method: "block",
      style: "insert-grid",
      icon: <GridOnIcon />,
    },
  ];

  return (
    <Box display="flex" gap={0.5}>
      {formatListText.map((item, idx) => (
        <button
          style={{
            color: "#222222",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={() => console.log("click")}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon ?? item.label}
        </button>
      ))}
    </Box>
  );
}
