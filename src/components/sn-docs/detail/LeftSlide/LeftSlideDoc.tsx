"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { Search } from "components/Filters";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import ArrowRight from "icons/ArrowRight";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useCreateDocMutation, useGetDocDetailQuery } from "store/docs/api";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";
import { uuid } from "utils/index";
import DocumentList from "./ItemDocs";
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
        width: {
          sm: "15%",
          xs: open ? "236px" : "0",
        },
        display: {
          xs: "none",
          sm: "block"
        }
      }}
    >
      {/* <Box
        sx={{
          position: "relative",
          height: "100%",
          backgroundColor: {
            sm: "unset",
            xs: "background.paper",
          },
          width: "100%",
          zIndex: "39",
          display: "block",
        }}
      >
        <Box
          onClick={() => setOpen((value) => !value)}
          sx={{
            position: "absolute",
            top: 0,
            left: open ? "calc(100% + 4px)" : "calc(100% - 16px)",
            padding: "4px",
            display: {
              sm: "none",
              xs: "flex",
            },
            zIndex: "30",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E1F0FF",
            transform: open ? "rotate(180deg)" : "unset",
          }}
        >
          <ArrowRight />
        </Box>
        <Box
          sx={{
            display: {
              sm: "block",
              xs: open ? "block" : "none",
            },
            width: {
              sm: "auto",
              xs: open ? "200px" : "0",
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
            }}
          />
          <Box>
            <Text
              sx={{
                marginTop: "8px",
              }}
              color={"grey"}
              variant={"h6"}
            >
              Page
            </Text>
            <DocumentList
              onClick={handleAddChild}
              handleChangeDocument={handleChangeDocument}
              data={data}
            />
          </Box>
        </Box>
      </Box> */}
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
