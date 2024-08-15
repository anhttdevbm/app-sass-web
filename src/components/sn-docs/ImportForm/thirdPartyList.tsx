import { Endpoint } from "api";
import Image from "next/image";
import MarkdownLogo from "public/images/thirdparty/Markdown.png";
import TrelloLogo from "public/images/thirdparty/Trello.png";
import TodoistLogo from "public/images/thirdparty/Todoist.png";
import DynalistLogo from "public/images/thirdparty/Dynalist.png";
import WorkflowyLogo from "public/images/thirdparty/Workflowy.png";
import NotionLogo from "public/images/thirdparty/Notion.png";
import GoogleDocsLogo from "public/images/thirdparty/GoogleDocs.png";
import ObsidianLogo from "public/images/thirdparty/Obsidian.png";
import LogseqLogo from "public/images/thirdparty/Logseq.png";
import BearLogo from "public/images/thirdparty/Bear.png";
import EvernoteLogo from "public/images/thirdparty/Evernote.png";

export enum ThirdpartyTyp {
  File = "file",
  Direct = "direct",
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
    icon: () => <Image src={MarkdownLogo} alt="Markdown Logo" />,
  },
  {
    text: "Trello",
    typ: ThirdpartyTyp.Direct,
    endpointURL: "",
    icon: () => <Image src={TrelloLogo} alt="Trello Logo" />,
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
    icon: () => <Image src={DynalistLogo} alt="Dynalist Logo" />,
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
    icon: () => <Image src={WorkflowyLogo} alt="Workflowy Logo" />,
  },
];

export default thirdPartyList;
