"use client";

import Action from "components/sn-project-detail/Budget/Action";
import Item from "components/sn-project-detail/Budget/Item";
import { useParams } from "next/navigation";

export const WrapBudgeting = () => {
  const { id: projectId } = useParams();
  return (
    <>
      <Action projectId={String(projectId ?? "")} />
      <Item projectId={String(projectId ?? "")} />
    </>
  );
};
