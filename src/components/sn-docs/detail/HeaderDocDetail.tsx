"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Stack, TextField } from "@mui/material";
import { Text, Tooltip } from "components/shared";
import { DocAccessibility } from "constant/enums";
import { NS_DOCS } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useDebounce from "hooks/useDebounce";
import BackIcon from "icons/BackIcon";
import CommentIcon from "icons/CommentIcon";
import CopyIcon from "icons/CopyIcon";
import MoreIcon from "icons/MoreIcon";
import OpenSidebarIcon from "icons/OpenSidebarIcon";
import ShareIcon from "icons/ShareIcon";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useGetDocDetailQuery, useUpdateDocMutation } from "store/docs/api";
import { useAppSelector } from "store/hooks";
import { NewPageContext } from "../news/context/NewPageContext";
import { IDocDetail } from "./DocDetail";
import ModalShare from "./LeftSlide/modal/ModalShare";
import SelectProjectInDoc from "./SelectProjectInDoc";
import useTheme from "hooks/useTheme";

const HeaderDocDetail = ({ setOpenSlider }: IDocDetail) => {
  const [openShare, setOpenShare] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const doc = useAppSelector((state) => state.doc);
  const docsT = useTranslations(NS_DOCS);
  const { data: document } = useGetDocDetailQuery(id as string);
  const [updateDoc] = useUpdateDocMutation();
  const [valueCopy, copy] = useCopyToClipboard();
  const { isSmSmaller } = useBreakpoint();
  const { setOpenComment } = useContext(NewPageContext);
  const [debounceChange] = useDebounce((value: string) => {
    updateDoc({ id: id as string, payload: { name: value } })
  }, 200);

  return (
    <>
      <ModalShare setOpenShare={setOpenShare} openShare={openShare} />
      <Box px={{ md: 3 }}>
        <Stack
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor="grey.100"
          spacing={{ xs: 2, md: 3 }}
          px={1}
          mb={{ xs: 1.5, md: 1, lg: 1.5 }}
          py={"16px"}
          bgcolor={"background.paper"}
        >
          {isSmSmaller && (
            <Box
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                },
                height: {
                  sm: "0px",
                },
                alignItems: "center",
              }}
            >
              <BackIcon
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => router.back()}
              />
              <SelectProjectInDoc></SelectProjectInDoc>
              <Text pr={"2px"}>/</Text>
              <TextField
                placeholder="Nhập Tên Doc"
                variant="outlined"
                sx={{
                  fieldset: {
                    border: "none",
                  },
                  input: {
                    padding: 0,
                  },
                  padding: 0,
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                }}
                value={document?.name}
                onChange={(e) => debounceChange(e.target.value)}
              />
            </Box>
          )}

          <Box
            sx={{
              px: {
                xs: "10px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                alignItems: "center",
              }}
            >
              <BackIcon
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => router.back()}
              />
              <SelectProjectInDoc />
              <Text pl={"3px"} pr={"6px"}>
                /
              </Text>
              <TextField
                placeholder="Nhập Tên Doc"
                variant="outlined"
                sx={{
                  fieldset: {
                    border: "none",
                  },
                  input: {
                    padding: 0,
                  },
                  padding: 0,
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                }}
                defaultValue={document?.name}
                title={document?.name}
                onChange={(e) => debounceChange(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: {
                  sm: "flex-end",
                  xs: "space-between",
                },
                gap: {
                  sm: "20px",
                  xs: "12px",
                },
              }}
            >
              <Text color={"success.main"}> 
                {DocAccessibility[doc.perm as keyof typeof DocAccessibility]}
              </Text>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: {
                    sm: "20px",
                    xs: "12px",
                  },
                }}
              >
                <Tooltip title={docsT("createDoc.share")}>
                  <Box onClick={() => setOpenShare(true)} sx={styleButton}>
                    <ShareIcon />
                  </Box>
                </Tooltip>
                <Tooltip
                  title={
                    valueCopy ? "Đã sao chép" : docsT("createDoc.copyLink")
                  }
                >
                  <Box
                    onClick={() => {
                      copy(window.location.href);
                      // setTimeout(() => {
                      //   copy(null);
                      // }, 5000);
                    }}
                    sx={styleButton}
                  >
                    <CopyIcon />
                  </Box>
                </Tooltip>
                <Tooltip title={docsT("createDoc.comment")}>
                  <Box
                    onClick={() => {
                      setOpenComment((value) => !value);
                      setOpenSlider(false);
                    }}
                    sx={styleButton}
                  >
                    <CommentIcon />
                  </Box>
                </Tooltip>
                <Tooltip title={docsT("createDoc.slider")}>
                  <Box
                    onClick={() => {
                      setOpenSlider((value) => !value);
                      setOpenComment(false);
                    }}
                    sx={{
                      ...styleButton,
                      color: isDarkMode ? "white" : "#212429",
                    }}
                  >
                    <OpenSidebarIcon />
                  </Box>
                </Tooltip>
                <Tooltip title={docsT("createDoc.more")}>
                  <Box sx={styleButton}>
                    <MoreIcon />
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

const styleButton = {
  padding: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

export default HeaderDocDetail;

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<any>(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
