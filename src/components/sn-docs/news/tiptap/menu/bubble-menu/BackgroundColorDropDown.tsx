"use client";

import Tippy from "@tippyjs/react";
import { Editor } from "@tiptap/core";
import { useContext, useMemo, useState } from "react";
import styles from "./backgroundColorDropDown.module.scss";
import dropButtonTogglestyles from "./colorTypeToggle.module.scss";
import { ThemeContext } from "components/sn-docs/news/context/ThemeContext";
import DownIcon from "components/sn-docs/news/asset/icons/DownIcon";

type TBackgroundColorOptions = {
  [key: string]: {
    icon: JSX.Element;
    color: string;
    label: string;
    textColor?: string;
  };
};

export const backgroundColorOptions: TBackgroundColorOptions = {
  white: {
    icon: <div className={`${styles.default}`}>A</div>,
    color: "white",
    label: "White",
    textColor: "black",
  },

  gray: {
    icon: <div className={`${styles.background_gray}`}>A</div>,
    color: "#898989",
    label: "Gray",
  },
  brown: {
    icon: <div className={`${styles.background_brown}`}>A</div>,
    color: "#976f5e",
    label: "Brown",
  },
  orange: {
    icon: <div className={`${styles.background_orange}`}>A</div>,
    color: "#ff8c00",
    label: "Orange",
  },
  yellow: {
    icon: <div className={`${styles.background_yellow}`}>A</div>,
    color: "#ffd700",
    label: "Yellow",
  },
  green: {
    icon: <div className={`${styles.background_green}`}>A</div>,
    color: "#4b8c67",
    label: "Green",
  },
  blue: {
    icon: <div className={`${styles.background_blue}`}>A</div>,
    color: "#0000ff",
    label: "Blue",
  },
  purple: {
    icon: <div className={`${styles.background_purple}`}>A</div>,
    color: "#800080",
    label: "Purple",
  },
  pink: {
    icon: <div className={`${styles.background_pink}`}>A</div>,
    color: "#ffc0cb",
    label: "Pink",
  },
  red: {
    icon: <div className={`${styles.background_red}`}>A</div>,
    color: "#ff0000",
    label: "Red",
  },
};

export const BackgroundColorDropDown = ({
  editor,
  handleClick,
  onCreate,
}: {
  editor: Editor;
  handleClick: any;
  onCreate: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const isWhiteHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.white.color,
  });
  const isGrayHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.gray.color,
  });
  const isBrownHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.brown.color,
  });
  const isOrangeHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.orange.color,
  });
  const isYellowHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.yellow.color,
  });
  const isGreenHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.green.color,
  });
  const isBlueHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.blue.color,
  });
  const isPurpleHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.purple.color,
  });
  const isPinkHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.pink.color,
  });
  const isRedHighlighted = editor.isActive("highlight", {
    color: backgroundColorOptions.red.color,
  });

  const colorType = useMemo(() => {
    if (isWhiteHighlighted) return backgroundColorOptions.white;
    if (isGrayHighlighted) return backgroundColorOptions.gray;
    if (isBrownHighlighted) return backgroundColorOptions.brown;
    if (isOrangeHighlighted) return backgroundColorOptions.orange;
    if (isYellowHighlighted) return backgroundColorOptions.yellow;
    if (isGreenHighlighted) return backgroundColorOptions.green;
    if (isBlueHighlighted) return backgroundColorOptions.blue;
    if (isPurpleHighlighted) return backgroundColorOptions.purple;
    if (isPinkHighlighted) return backgroundColorOptions.pink;
    if (isRedHighlighted) return backgroundColorOptions.red;
    return backgroundColorOptions.white;
  }, [
    isWhiteHighlighted,
    isGrayHighlighted,
    isBrownHighlighted,
    isOrangeHighlighted,
    isYellowHighlighted,
    isGreenHighlighted,
    isBlueHighlighted,
    isPurpleHighlighted,
    isPinkHighlighted,
    isRedHighlighted,
  ]);

  return (
    <Tippy
      onCreate={onCreate}
      appendTo={document.body}
      trigger="click"
      interactive
      animation="shift-toward-subtle"
      placement="bottom-start"
      offset={[0, 8]}
      zIndex={9999}
      content={
        <div className={`${styles.color_menu} ${styles[theme]}`}>
          <div className={`${styles.color_menu_dropdown}`}>
            BACKGROUND COLOR
          </div>

          {Object.entries(backgroundColorOptions).map(([key, value]) => {
            return (
              <div
                className={`${styles.color_dropdown_button}`}
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setColor(value.textColor || "white")
                    .toggleHighlight({ color: value.color })
                    .run();
                  handleClick();
                }}
              >
                <div className={`${styles.info}`}>
                  {value.icon}
                  <span className={`${styles.label}`}>{value.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      }
    >
      <div
        className={`${dropButtonTogglestyles.color_toggle_dropdown}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {colorType && (
          <div
            style={{
              backgroundColor: colorType.color,
              paddingLeft: "10px",
              paddingRight: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2px",
              paddingBottom: "2px",
              color: colorType.textColor || "white",
            }}
          >
            A
          </div>
        )}
        {/* <span className="truncate">{colorType()}</span> */}
      </div>
    </Tippy>
  );
};
