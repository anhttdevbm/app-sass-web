"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import { Search } from "components/Filters";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";
import TreeViewDocuments from "../components/TreeViewDocuments";
import useLeftSlideDoc from "./hooks/useLeftSlideDoc";

export interface LeftSlideDocProps {
  open: boolean;
  setOpen?: any;
}

const LeftSlideDoc = ({ open, setOpen }: LeftSlideDocProps) => {
  const dataFake = useAppSelector((state) => state.doc.docDetails.data);
  const docsT = useTranslations(NS_DOCS);
  const [search, setSearch] = useState("");
  const onChangeQueries = (name: string, value: any) => {
    setSearch(value);
  };

  const { handleGetDocDetail } = useDocs();
  const { handleAddChild, document, data } = useLeftSlideDoc();

  const handleChangeDocument = (id: string) => {
    handleGetDocDetail(id);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minWidth: "236px",
        display: {
          xs: "none",
          sm: "block",
        },
      }}
    >
      <Search
        placeholder={docsT("filter.search", { name: "email" })}
        name="doc"
        onChange={onChangeQueries}
        value={search}
        sx={{
          width: "100%",
          ".MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
          },
          mb: "16px",
        }}
      />
      <Text
        sx={{
          marginTop: "8px",
        }}
        color={"grey"}
        variant={"h6"}
      >
        Page
      </Text>
      <TreeViewDocuments doc={document} />
    </Box>
  );
};

export default memo(LeftSlideDoc);
