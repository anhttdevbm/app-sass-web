import { Endpoint } from "api";
import BearIcon from "icons/BearIcon";
import DynalistIcon from "icons/DynalistIcon";
import EvernoteIcon from "icons/EvernoteIcon";
import GoogleDocsIcon from "icons/GoogleDocsIcon";
import LogseqIcon from "icons/LogseqIcon";
import MarkdownIcon from "icons/MarkdownIcon";
import NotionIcon from "icons/NotionIcon";
import ObsidianIcon from "icons/ObsidianIcon";
import TodoistIcon from "icons/TodoistIcon";
import TrelloIcon from "icons/TrelloIcon";
import WorkflowyIcon from "icons/WorkflowyIcon";

export enum ThirdpartyTyp {
  File = "file",
  Direct = "direct",
  Others = "others",
}

export interface IThirdPartyItem {
  text: string;
  typ: ThirdpartyTyp;
  file?: {
    name: string;
    type: string;
    ext: string;
  };
  extList?: string[];
  endpointURL: string;
  icon: () => JSX.Element;
}

const thirdPartyList: IThirdPartyItem[] = [
  {
    text: "Markdown & Text",
    typ: ThirdpartyTyp.File,
    file: {
      name: "markdown",
      type: "text/markdown",
      ext: ".md",
    },
    extList: [".txt", ".md"],
    endpointURL: Endpoint.AI_DOCS_IMPORT_MD,
    icon: () => <MarkdownIcon />,
  },
  {
    text: "Trello",
    typ: ThirdpartyTyp.Direct,
    endpointURL: "",
    icon: () => <TrelloIcon />,
  },
  {
    text: "Todoist",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <TodoistIcon />,
  },
  {
    text: "Dynalist",
    typ: ThirdpartyTyp.File,
    file: {
      name: "opml",
      type: "application/xml",
      ext: ".opml",
    },
    extList: [".opml"],
    endpointURL: Endpoint.AI_DOCS_IMPORT_OPML,
    icon: () => <DynalistIcon />,
  },
  {
    text: "Workflowy",
    typ: ThirdpartyTyp.File,
    file: {
      name: "opml",
      type: "application/xml",
      ext: ".opml",
    },
    extList: [".opml"],
    endpointURL: Endpoint.AI_DOCS_IMPORT_OPML,
    icon: () => <WorkflowyIcon />,
  },
  {
    text: "Notion",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <NotionIcon />,
  },
  {
    text: "Google Docs",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <GoogleDocsIcon />,
  },
  {
    text: "Obsidian",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <ObsidianIcon />,
  },
  {
    text: "Logseq",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <LogseqIcon />,
  },
  {
    text: "Bear",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <BearIcon />,
  },
  {
    text: "Evernote",
    typ: ThirdpartyTyp.Others,
    endpointURL: "",
    icon: () => <EvernoteIcon />,
  },
];

export default thirdPartyList;
