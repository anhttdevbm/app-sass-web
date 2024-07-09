import Container from "@mui/material/Container";
import KanbanViewItem from "../KanbanViewItem";
import { useState } from "react";

export interface IAvatarKanBanViewDoc {
  object: string;
    name: string;
    link: string;
}

export interface ICUKanbanViewDocItem {
  id: string;
  email: string;
  roles: string[];
  company: string;
  fullname: string;
  position: {
    id: string;
    name: string;
  };
  avatar: IAvatarKanBanViewDoc
}

export interface IKanbanViewDocItem {
  _id: string;
  id: string;
  name: string;
  created_time: string;
  updated_time: string;
  created_by?: ICUKanbanViewDocItem;
  updated_by?: ICUKanbanViewDocItem;
  owner?: ICUKanbanViewDocItem;
  avatar: IAvatarKanBanViewDoc;
}

export default function KanbanViewDocList({ listData }: { listData: IKanbanViewDocItem[] }) { 
  return (
    <Container sx={{ paddingX: 46, paddingY: 4, display: "flex", flexWrap: "wrap", gap: 4, overflow: "auto" }}>
      {listData?.map((item: IKanbanViewDocItem) => (
        <KanbanViewItem 
        itemKanban={item} key={item._id} 
        />
      ))}
    </Container>
  );
}