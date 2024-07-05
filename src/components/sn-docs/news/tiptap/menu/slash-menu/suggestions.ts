/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import fuzzysort from "fuzzysort";
import tippy from "tippy.js";
import { stopPrevent } from "../../utils/eventModifier";
import { CommandList } from "./CommandList";
import textImg from "../../../asset/images/bubble-menu/en-US.png";
import headerImg from "../../../asset/images/bubble-menu/header.57a7576a.png";
import subHeaderImg from "../../../asset/images/bubble-menu/subheader.9aab4769.png";
import subSubHeaderImg from "../../../asset/images/bubble-menu/subsubheader.d0ed0bb3.png";
import numberedImg from "../../../asset/images/bubble-menu/numbered-list.0406affe.png";
import bulletImg from "../../../asset/images/bubble-menu/bulleted-list.0e87e917.png";
import toDoImg from "../../../asset/images/bubble-menu/to-do.f8d20542.png";
import quoteImg from "../../../asset/images/bubble-menu/quote.png";
import dividerImg from "../../../asset/images/bubble-menu/divider.210d0faf.png";
import codeImg from "../../../asset/images/bubble-menu/code.a8b201f4.png";
import artImg from "../../../asset/images/bubble-menu/image.33d80a98.png";
import videoImg from "../../../asset/images/bubble-menu/video.ceeec2c7.png";
import tableImg from "../../../asset/images/bubble-menu/simple-table.e31a23bb.png";
import columnImg from "../../../asset/images/bubble-menu/columnList.63d7ab92.png";

interface SlashMenuItem {
  title: any;
  command: (params: { editor: Editor; range: Range }) => void;
  img?: any;
  icon?: any;
  shortcut: string;
  type: string;
  desc: string;
}

const SlashMenuItems: Partial<SlashMenuItem>[] = [
  {
    title: "Heading 1",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
    img: headerImg,
    shortcut: "#",
    desc: "Big section heading.",
  },
  {
    title: "Heading 2",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
    img: subHeaderImg,
    shortcut: "##",
    desc: "Medium section heading.",
  },
  {
    title: "Heading 3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
    img: subSubHeaderImg,
    shortcut: "###",
    desc: "Small section heading.",
  },
  {
    title: "Ordered List",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
    img: numberedImg,
    desc: "Create a list with numbering.",
    shortcut: "1. L",
  },
  {
    title: "Bullet List",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    img: bulletImg,
    shortcut: "- L",
    desc: "Create a simple bulleted list.",
  },
  {
    title: "Task List.",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
    img: toDoImg,
    shortcut: "- TL",
    desc: "Track tasks with a to-do list.",
  },
  {
    title: "Block Quote",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
    img: quoteImg,
    desc: "Capture a quote.",
    shortcut: "- BQ",
  },
  {
    title: "Divider",
    command: ({ editor, range }) => {
      editor.chain().deleteRange(range).setHorizontalRule().run();
    },
    img: dividerImg,
    desc: "Visual divide page.",
    shortcut: "- D",
  },
  {
    title: "Code",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCode().run();
    },
    img: codeImg,
    desc: "Capture a code snippet.",
    shortcut: "- C",
  },
  {
    title: "Image",
    command: ({ editor, range }) => {
      editor
        .chain()
        .deleteRange(range)
        .setMedia({
          src: "https://source.unsplash.com/8xznAGy4HcY/800x400",
          "media-type": "img",
          alt: "Something else",
          title: "Something",
          width: "800",
          height: "400",
        })
        .run();
    },
    img: artImg,
    desc: "Upload or embed with a link.",
    shortcut: "- I",
  },
  {
    title: "Video",
    command: ({ editor, range }) => {
      editor
        .chain()
        .deleteRange(range)
        .setMedia({
          src: "https://www.youtube.com/watch?v=XS088Opj9o0",
          "media-type": "video",
          alt: "Some video",
          title: "Some Title Video",
          width: "800",
          height: "400",
        })
        .run();
    },
    img: videoImg,
    desc: "Embed from YouTube, Vimeo",
    shortcut: "- V",
  },
  {
    title: "Table",
    command: ({ editor, range }) => {
      // editor.chain().focus().deleteRange(range).toggleBulletList().run();

      editor
        .chain()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
    img: tableImg,
    desc: "Add simple tabular content to your page.",
    shortcut: "- T",
  },
  {
    title: "2 Columns",
    command: ({ editor, range }) => {
      editor
        .chain()
        .deleteRange(range)
        .insertTable({ rows: 1, cols: 2, withHeaderRow: false })
        .run();
    },
    img: columnImg,
    desc: "Create 2 columns of blocks.",
    shortcut: "- TC",
  },
  {
    title: "3 Columns",
    command: ({ editor, range }) => {
      editor
        .chain()
        .deleteRange(range)
        .insertTable({ rows: 1, cols: 3, withHeaderRow: false })
        .run();
    },
    img: columnImg,
    desc: "Create 3 columns of blocks.",
    shortcut: "- THC",
  },
  {
    title: "4 Column",
    command: ({ editor, range }) => {
      editor
        .chain()
        .deleteRange(range)
        .insertTable({ rows: 1, cols: 4, withHeaderRow: false })
        .run();
    },
    img: columnImg,
    desc: "Create 4 columns of blocks.",
    shortcut: "- FC",
  },
];

export const suggestion = {
  char: "/",
  command: ({ editor, range, props }: any) => {
    props.command({ editor, range, props });
  },
  items: ({ query: q }: { query: string }) => {
    const query = q.toLowerCase().trim();

    if (!query) return SlashMenuItems;

    const fuzzyResults = fuzzysort
      .go(query, SlashMenuItems, { key: "title" })
      .map((item) => ({
        ...item,
        highlightedTitle: fuzzysort.highlight(item, "<b>", "</b>"),
      }));

    return fuzzyResults.map(({ obj, highlightedTitle }) => ({
      ...obj,
      highlightedTitle,
    }));
  },

  render: () => {
    let component: ReactRenderer;
    let popup: { destroy: () => void }[];
    let localProps: Record<string, any> | undefined;

    return {
      onStart: (props: Record<string, any> | undefined) => {
        localProps = { ...props, event: "" };

        component = new ReactRenderer(CommandList, {
          props: localProps,
          editor: localProps?.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: localProps.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          animation: "shift-toward-subtle",
          duration: 250,
        });
      },

      onUpdate(props: Record<string, any> | undefined) {
        localProps = { ...props, event: "" };

        component.updateProps(localProps);

        (popup[0] as any).setProps({
          getReferenceClientRect: localProps.clientRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        component.updateProps({ ...localProps, event: props.event });

        (component.ref as any).onKeyDown({ event: props.event });

        if (props.event.key === "Escape") {
          (popup[0] as any).hide();

          return true;
        }

        if (props.event.key === "Enter") {
          stopPrevent(props.event);

          return true;
        }

        return false;
      },

      onExit() {
        if (popup && popup[0]) popup[0]?.destroy();
        if (component) component.destroy();
      },
    };
  },
};
