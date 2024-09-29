import { Box } from "@mui/material";
import BasicViewDocItem from "../BasicViewItem";
import { IViewDocItem } from "../KanbanViewDocList";

export interface IResDocumentItem {
  docs: IViewDocItem[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default function BasicViewDocList({ data }: { data: IViewDocItem[] }) {
  return (
    <Box
      sx={{
        paddingX: { xs: 0.5, md: 4 },
        paddingY: 1,
        flex: 1,
      }}
      overflow="auto"
    >
      {data?.map((item, index) => (
        <BasicViewDocItem
          key={item.group_by ?? index}
          keyExpanded={item.group_by ?? index}
          data={item}
        />
      ))}
    </Box>
  );
}
