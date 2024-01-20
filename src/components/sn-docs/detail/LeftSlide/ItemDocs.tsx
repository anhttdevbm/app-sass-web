/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-children-prop */
"use client";
import { Box } from "@mui/material";
import { Text } from "components/shared";
import DocsItem from "icons/DocsItem";
import IconAdd from "icons/IconAdd";
import React, { memo } from "react";
import MorePoper from "./MorePoper";
import { IDocument } from "constant/types";

export interface ItemDocsProps {
  onClick?: any;
  handleChangeDocument?: any;
  title: string | undefined;
  project_id?: string;
  id?: string;
  children: ItemDocsProps[] | undefined;
}
type TDocumentListProps = {
  isFirst?: boolean;
  data: IDocument;
  onClick: any;
  handleChangeDocument: any;
};

const Document = ({
  title,
  id,
  project_id,
  onClick,
  handleChangeDocument,
}: ItemDocsProps) => {
  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 1,
          ":hover": {
            " .btn-more": {
              visibility: "visible",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          onClick={() => handleChangeDocument(id)}
        >
          <DocsItem></DocsItem>
          <Text sx={{ flex: 1 }} fontWeight={600} fontSize={14}>
            {title}
          </Text>
        </Box>
        <Box
          className="btn-more"
          sx={{
            visibility: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 1.4,
          }}
        >
          <MorePoper></MorePoper>
          <Box
            onClick={() => onClick(id, project_id)}
            sx={{
              cursor: "pointer",
            }}
          >
            <IconAdd></IconAdd>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const DocumentList: React.FC<TDocumentListProps> = ({
  data,
  onClick,
  handleChangeDocument,
}) => {
  console.log({ doc_data: data });
  return (
    <>
      <Document
        onClick={onClick}
        children={data?.child}
        id={data?.id}
        project_id={data?.project_id}
        handleChangeDocument={handleChangeDocument}
        title={data?.name}
      />
      {data?.child && (
        <Box
          sx={{
            marginLeft: {
              md: "24px",
              xs: "16px",
            },
          }}
        >
          {Array.isArray(data?.child) &&
            data?.child?.map((item: IDocument) => {
              return (
                <DocumentList
                  onClick={onClick}
                  key={item._id}
                  data={item}
                  handleChangeDocument={handleChangeDocument}
                />
              );
            })}
        </Box>
      )}
    </>
  );
};

export default memo(DocumentList);
