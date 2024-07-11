import Container from "@mui/material/Container";
import KanbanViewItem from "../KanbanViewItem";

export interface IAvatarViewDoc {
  object: string;
  name: string;
  link: string;
  status?: number;
  code?: string;
  errors?: { location: string; param: string }[];
}

export interface ICUViewDocItem {
  id: string;
  email: string;
  roles: string[];
  company: string;
  fullname: string;
  position: {
    id: string;
    name: string;
  };
  avatar: IAvatarViewDoc;
}

export interface IGroupInfoDoc {
  _id: string;
  id: string;
  name: string;
  number: number;
  expected_cost: number;
  working_hours: number;
  description: string;
  created_time: string;
  created_by: string;
  is_active: boolean;
  status: string;
  saved: boolean;
  company: string;
  avatar: IAvatarViewDoc;
  working_hours_real: number;
  actual_costs: number;
  members: { id: string; email: string; date_in: string }[];
  updated_by: string;
  updated_time: string;
  currency: string;
  owner: string;
  start_date: string;
  type_project: string;
}

export interface IDocItem {
  _id: string;
  id: string;
  name: string;
  created_time: string;
  updated_time: string;
  created_by?: ICUViewDocItem;
  updated_by?: ICUViewDocItem;
  owner?: ICUViewDocItem;
  avatar: IAvatarViewDoc;
}

export interface IViewDocItem {
  group_by?: string;
  groupInfo?: IGroupInfoDoc;
  docs: IDocItem[];
}

export default function KanbanViewDocList({
  listData,
}: {
  listData: IViewDocItem[];
}) {
  return (
    <Container
      sx={(theme) => ({
        display: "flex",
        overflow: "auto",
        [theme.breakpoints.up('md')]: {
          paddingX: 46,
          paddingY: 4,
          flexWrap: "wrap",
          gap: 4,
        },
        [theme.breakpoints.up('xs')]: {
          flexDirection: "column",
          gap: 2
        }
      })}
    >
      {listData?.map((item: IViewDocItem ,index) => (
        <KanbanViewItem itemKanban={item} key={item.group_by ?? index} />
      ))}
    </Container>
  );
}
