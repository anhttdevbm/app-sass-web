/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import FilterMember from "./FilterMember";
import FilterMemberEdit from "./FilterMemberEdit";
import FilterProject from "./FilterProject";
import FilterSharingType from "./FilterSharingType";
import { GetDocQueries } from "../helpers";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";

export interface FilterSearchDocsProps {
  onChange: (queries: Partial<GetDocQueries>) => void;
}

const FilterSearchDocs = ({ onChange }: FilterSearchDocsProps) => {
  const { user } = useAuth();

  return (
    <>
      <FilterProject onChange={onChange} />
      {!user?.roles.includes(Permission.ST) && (
        <FilterMember onChange={onChange} />
      )}
      <FilterMemberEdit onChange={onChange} />
      <FilterSharingType />
    </>
  );
};

export default memo(FilterSearchDocs);
