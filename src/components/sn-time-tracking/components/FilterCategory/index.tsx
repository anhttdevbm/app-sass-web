/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Box } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import SortByCategory, { SelectDataProps } from "../Search";
import { useProjects } from "store/project/selectors";
import { useEmployeeOptions } from "store/company/selectors";

interface IProps {
  personVisibleFilter?: boolean;
  periodVisibleFilter?: boolean;
}

const convertToSelectData = <T extends { id: string }>(
  data: T[],
  valueKey: keyof T,
): SelectDataProps[] => {
  return data.map((item) => ({
    id: item.id,
    value: item[valueKey] as unknown as string,
  }));
};

const FilterCategory: React.FC<IProps> = ({
  personVisibleFilter = true,
  periodVisibleFilter = true,
}) => {
  const { items: projects } = useProjects();
  const { items: employees, onGetOptions: onGetEmployeeOptions } =
    useEmployeeOptions();
  useEffect(() => {
    if (personVisibleFilter) {
      onGetEmployeeOptions({ pageIndex: 1, pageSize: 50 });
    }
  }, []);

  const projectsSelectData = useMemo(() => {
    return convertToSelectData(projects, "name");
  }, [projects]);

  const employeesSelectData = useMemo(() => {
    return convertToSelectData(employees, "fullname");
  }, [employees]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #EFEFEF",
        borderRadius: "100px",
        padding: "14px 1.5rem",
        background: "#F7F7FD",
        width: "100%",
        height: " 60px",
      }}
    >
      <p
        style={{
          marginRight: "2px",
          fontSize: "13px",
          fontWeight: "bold",
          color: "neutral.700",
        }}
      >
        View by:{" "}
      </p>
      <SortByCategory title="Project" data={projectsSelectData} />
      {periodVisibleFilter && <SortByCategory title="Period" data={null} />}
      {personVisibleFilter && (
        <SortByCategory title="Person" data={employeesSelectData} />
      )}
    </Box>
  );
};

export default FilterCategory;
