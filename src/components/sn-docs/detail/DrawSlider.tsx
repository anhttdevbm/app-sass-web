/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, IconButton, Stack } from "@mui/material";
import { client } from "api";
import { AxiosError, AxiosRequestConfig, HttpStatusCode } from "axios";
import Avatar from "components/Avatar";
import { Switch } from "components/Filters";
import { Text, Tooltip } from "components/shared";
import { DOCS_API_URL, NS_DOCS } from "constant/index";
import { User } from "constant/types";
import { format } from "date-fns";
import CloseIcon from "icons/CloseIcon";
import HistoryIcon from "icons/HistoryIcon";
import RestoreIcon from "icons/RestoreIcon";
import TextIcon from "icons/TextIcon";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setContentRow } from "store/docs/reducer";

declare type TDocHistory = {
  _id: string;
  doc: string;
  user: Partial<User>;
  action: any;
  // "UPDATE_NAME";
  time: Date;
  old: string;
  new: string;
};

const HistoryDocItem: React.FC<{ data: TDocHistory }> = ({ data }) => {
  const docsT = useTranslations(NS_DOCS);
  const dispatch = useDispatch();
console.log(data, 'ff')
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: 'pointer'
      }}
      onClick={() => dispatch(setContentRow(data?.new))}
    >
      <Box>
        <Text
          sx={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {format(new Date(data?.time), "d MMM yyyy h:mm a")}
        </Text>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              overflow: "hidden",
              bgcolor: "black",
              borderRadius: "100%",
            }}
          >
            <Avatar
              size={16}
              src={data.user?.avatar?.link || "https://picsum.photos/60"}
            />
          </Box>
          <Text
            sx={{
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {data.user?.email || "Unknown"}
          </Text>
        </Box>
      </Box>
      <Tooltip title={docsT("createDoc.restore")}>
        <Box
          sx={{
            cursor: "pointer",
            p: "4px",
          }}
        >
          <RestoreIcon />
        </Box>
      </Tooltip>
    </Box>
  );
};

function useGetDocHistory(
  docId: string,
  params?: AxiosRequestConfig["params"],
): {
  data: Array<TDocHistory>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
} {
  const [fetchingState, setFetchingState] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });
  const [documentUpdateHistory, setDocumentUpdateHistory] = useState([]);

  useEffect(() => {
    const getDocsHistory = async (
      docId: string,
      params?: AxiosRequestConfig["params"],
    ) => {
      try {
        setFetchingState((prev) => ({ ...prev, isLoading: true }));
        const response = await client.get(
          DOCS_API_URL + "/docs/history/" + docId,
          {
            params,
          },
        );

        if (response.status !== HttpStatusCode.Ok)
          throw new Error("Failed to get documents history");
        setDocumentUpdateHistory(response.data?.docs);
        setFetchingState((prev) => ({ ...prev, isSuccess: true }));
      } catch (error) {
        const axiosError = error as unknown as AxiosError;
        setDocumentUpdateHistory([]);
        setFetchingState((prev) => ({
          ...prev,
          isError: true,
          isLoading: false,
        }));
        console.error(axiosError.message);
      }
    };
    getDocsHistory(docId);
  }, [docId]);

  return { data: documentUpdateHistory, ...fetchingState };
}

const DrawSlider = ({
  setOpenSlider,
}: {
  setOpenSlider: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [state, setState] = useState(2);
  const docsT = useTranslations(NS_DOCS);
  const params = useParams();
  const [isLargeText, setLargeText] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const { data } = useGetDocHistory(params.id as unknown as string, {
    sort_by: "Desc",
    order_by: "time",
  });
  const onChangeText = (name: string, value: any) => {
    setLargeText(value);
  };
  const onChangeFull = (name: string, value: any) => {
    setIsFull(value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          justifyItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Box
            onClick={() => setState(1)}
            sx={{
              padding: "4px",
              cursor: "pointer",
            }}
          >
            <TextIcon active={state === 1} />
          </Box>
          <Box
            sx={{
              padding: "4px",
              cursor: "pointer",
            }}
            onClick={() => setState(2)}
          >
            <HistoryIcon active={state === 2} />
          </Box>
        </Box>

        <IconButton
          onClick={() => setOpenSlider(false)}
          sx={{ width: 32, height: 32, aspectRatio: 1, borderRadius: "9999px" }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Text
        sx={{
          my: "4px",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {state === 1 && docsT("createDoc.text")}
        {state === 2 && docsT("createDoc.history")}
      </Text>
      <Stack
        spacing={"16px"}
        sx={{
          marginTop: "12px",
        }}
      >
        {state === 1 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "background.paper",
              }}
            >
              <Text fontSize={14} fontWeight={600}>
                {docsT("createDoc.Ltext")}
              </Text>
              <Switch
                name="text"
                onChange={onChangeText}
                size="small"
                reverse
                value={isLargeText}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text fontSize={14} fontWeight={600}>
                {docsT("createDoc.full")}
              </Text>
              <Switch
                name="text"
                onChange={onChangeFull}
                size="small"
                reverse
                value={isFull}
              />
            </Box>
          </>
        )}
        {state === 2 &&
          Array.isArray(data) &&
          data.map((item) => <HistoryDocItem data={item} key={item._id} />)}
      </Stack>
    </>
  );
};

export default memo(DrawSlider);
