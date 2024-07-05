/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Picker from "@emoji-mart/react";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { setPage } from "store/docs/reducer";
import { useAppSelector } from "store/hooks";
import twemoji from "twemoji";
import { ThemeContext } from "../../context/ThemeContext";
import { PageType } from "../../types/Page";
import styles from "../scss/emojiSelector.module.scss";

type EmojiSelectorProps = {
  openPicker: boolean;
  closePicker: () => void;
  setEmoji: (emojiImage: string) => void;
  setEmojiCode: (unified: string) => void;
  leftOpen: boolean;
  fullWidth: boolean;
  cover: boolean;
};

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  openPicker,
  closePicker,
  setEmojiCode,
  setEmoji,
  leftOpen,
  fullWidth,
  cover,
}) => {
  const { theme } = useContext(ThemeContext);
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  const workspaceInfo = useAppSelector((state) => state.doc.workspaceInfo);
  const dispatch = useDispatch();

  const emojiSelected = async (data: { unified: string }) => {
    const emojiImage = twemoji.parse(
      `https://twemoji.maxcdn.com/v/latest/72x72/${data.unified}.png`,
    );

    setEmojiCode(data.unified);
    setEmoji(emojiImage);

    const pageData = {
      icon: data.unified!,
      pageId: pageInfo?.id!,
    };

    const updatedPage = {
      ...pageInfo!,
      icon: data.unified,
    };
    // const workspace = await request({
    //   url: `/workspaces/${workspaceInfo?.id}`,
    // });
    dispatch(setPage(updatedPage));
    // dispatch(setWorkspace({ ...workspace.data }));

    const savedState = localStorage.getItem("pagesListState");
    const parsedSavedState: PageType[] = JSON.parse(savedState!);

    for (let i = 0; i < parsedSavedState.length; i++) {
      if (parsedSavedState[i].id === pageInfo?.id) {
        parsedSavedState[i].icon = data.unified;
        break;
      }
    }

    localStorage.setItem("pagesListState", JSON.stringify(parsedSavedState));
    closePicker();
  };

  if (!openPicker) return null;

  return (
    <div
      className={`${styles.emoji_selector_background} ${
        fullWidth ? styles.full_width : ""
      } ${leftOpen ? "" : styles.left_open} ${cover ? styles.cover : ""}`}
      onClick={closePicker}
    >
      <div
        className={`${styles.emoji_selector}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Picker set="twitter" onEmojiSelect={emojiSelected} theme={theme} />
      </div>
    </div>
  );
};

export default EmojiSelector;
