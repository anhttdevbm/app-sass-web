"use client";

import { Box, TextareaAutosize } from "@mui/material";
import { Editor } from "@tiptap/react";
import { IDocDetail } from "components/sn-docs/detail/DocDetail";
import DrawSlider from "components/sn-docs/detail/DrawSlider";
import useTheme from "hooks/useTheme";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";
import ChangeCover from "../change-cover-panel";
import { ThemeContext } from "../context/ThemeContext";
import { Tiptap } from "../tiptap/Tiptap";
import styles from "./scss/pageBody.module.scss";
/* eslint-disable no-var */
import DrawComment, {
  LayoutSlider,
} from "components/sn-docs/detail/DrawComment";
import useDebounce from "hooks/useDebounce";
import {
  changeContentDoc,
  changeDescription,
  changeTitle,
  getDocDetails,
  resetDocDetail,
} from "store/docs/reducer";
import useDocEditor from "../hook/useDocEditor";
import { NewPageContext } from "../context/NewPageContext";
import { DocAccessibility } from "constant/enums";
import styled from "@emotion/styled";
import { useUpdateDocMutation } from "store/docs/api";
import { TextSelection } from "prosemirror-state";
import { MenuBarHeaderEdit } from "./components/MenuBarHeader";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

const PageBody = ({ openSlider, setOpenSlider }: IDocDetail) => {
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  let {
    perm,
    content,
    id,
    title: name,
    description,
    project_id,
  } = useAppSelector((state) => state.doc);
  const dispatch = useDispatch();
  const { handleGetDocDetail } = useDocs();
  const currentId = useAppSelector((state) => state.doc.id);

  const [openChangeCover, setOpenChangeCover] = useState<boolean>(false);
  const { theme } = useContext(ThemeContext);
  const { openComment } = useContext(NewPageContext);
  const [minHeight, setMinHeight] = useState("100vh");
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { handleUpdateDoc } = useDocs();

  const [updateDoc] = useUpdateDocMutation();
  const [debounceChange, isDone, cancel] = useDebounce((value: string) => {
    updateDoc({ id: currentId as string, payload: { name: value } });
  }, 200);

  useEffect(() => {
    cancel();
    dispatch(getDocDetails(currentId));
  }, [currentId]);

  useEffect(() => {
    // const data = {
    //   content: content,
    //   name: name || undefined,
    //   description: description,
    //   project_id: project_id,
    // };
    if (mounted) {
      if (id) {
        // handleUpdateDoc(data, id);
      } else {
      }
    } else {
      setMounted(true);
    }
  }, [description, name, content, project_id, currentId]);

  useEffect(() => {
    const data = {
      content: content,
      name: name || undefined,
      description: description,
      project_id: project_id,
    };
    if (mounted) {
      if (id) {
        handleUpdateDoc(data, id);
      } else {
      }
    } else {
      setMounted(true);
    }
  }, [content]);

  const editor = useDocEditor() as Editor;

  useEffect(() => {
    const updateMinHeight = () => {
      const windowHeight: number = window.innerHeight;
      const elementPosition: DOMRect | undefined = document
        .getElementById("is-edit-text")
        ?.getBoundingClientRect();
      if (elementPosition) {
        const newMinHeight: string =
          windowHeight - (elementPosition.top + 50) + "px"; //
        setMinHeight(newMinHeight);
      }
    };

    window.addEventListener("scroll", updateMinHeight);
    window.addEventListener("resize", updateMinHeight);
    updateMinHeight();

    return () => {
      window.removeEventListener("scroll", updateMinHeight);
      window.removeEventListener("resize", updateMinHeight);
      dispatch(resetDocDetail());
    };
  }, []);

  const canEdit = useMemo<boolean>(() => {
    return Object.keys(DocAccessibility)
      .filter(
        (key) =>
          key === ("FULL_ACCESS" as keyof typeof DocAccessibility) ||
          key === ("EDIT" as keyof typeof DocAccessibility),
      )
      .includes(perm);
  }, [perm]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        height: "100%",
      }}
    >
      {editor && <MenuBarHeaderEdit editor={editor} />}
      <Box
        sx={{
          paddingBottom: {
            sm: "0",
            xs: "160px",
          },
          width: {
            sm: "100%",
            xs: "100%",
          },
        }}
      >
        <div className={`${styles.content}} ${styles[theme]}`}>
          <Box
            sx={{
              position: "relative",
              bgcolor: isDarkMode ? "#191919" : "white",
              padding: {
                sm: "32px 40px",
                xs: "12px",
              },
              minHeight: minHeight,
            }}
            id="is-edit-text"
            className={` ${styles.page_content} ${
              pageInfo?.pageSettings?.fullWidth ? "" : styles.full_width
            }
          ${pageInfo?.pageSettings?.smallText ? styles.small_text : ""}
          ${styles[pageInfo?.pageSettings?.font!]}
          `}
          >
            {openComment && (
              <LayoutSlider heightToolbar={minHeight}>
                <DrawComment editor={editor} />
              </LayoutSlider>
            )}
            {openSlider && (
              <LayoutSlider heightToolbar={minHeight}>
                <DrawSlider setOpenSlider={setOpenSlider}></DrawSlider>
              </LayoutSlider>
            )}
            <form className={`${styles.form_title}`}>
              {name && (
                <Textarea
                  maxRows={3}
                  id="title"
                  disabled={!canEdit}
                  defaultValue={name}
                  placeholder="Enter document title..."
                  onChange={(e) => {
                    debounceChange(e.target.value);
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              )}
            </form>
            <div
              className={`${styles.editor}`}
              style={{
                pointerEvents: canEdit ? "auto" : "none",
                height: "50vh",
                overflowY: "scroll",
              }}
            >
              <Tiptap editor={editor} disabled={!canEdit} />
            </div>
          </Box>
        </div>
        <ChangeCover
          open={openChangeCover}
          onClose={() => setOpenChangeCover(false)}
        />
      </Box>
    </Box>
  );
};

const Textarea = styled(TextareaAutosize)`
  border: none;
  outline: none;
  font-size: 48px;
  appearance: none;
  font-family: inherit;
  font-weight: 800;
  resize: none;
  min-width: 100%;
  background-color: transparent;
  color: inherit;
  padding-left: 1rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default PageBody;
