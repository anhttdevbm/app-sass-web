import { COLORS } from "components/Editor";
import "quill-mention/dist/quill.mention.css"; // Import CSS for the mention module
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectListAgent } from "store/ticket-agent/selectors";

// Define the mention module configuration
const useModuleTextEditor = () => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const listAgents = useSelector(selectListAgent);

  const listAgentFilter = React.useMemo(() => {
    if (!listAgents || !listAgents?.data) return [];
    return listAgents?.data?.map((it) => ({
      ...it,
      value: it?.detail?.fullname,
      id: it?.detail?.id,
    }));
  }, [listAgents]);

  const moduleConfig = React.useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ color: [] }, { background: ["transparent", ...COLORS] }], // dropdown with defaults from theme
          ["attachment", "image"],
          ["clean"],
        ],
        handlers: {
          attachment: () => {
            inputFileRef?.current?.click();
          },
          image: () => {
            inputFileRef?.current?.click();
          },
        },
      },
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ["@"],
        spaceAfterInsert: true,
        onSelect: (item: any, insertItem: (value: string) => void) => {
          insertItem(item);
        },
        source: async function (searchTerm: string, renderList: any) {
          if (searchTerm.length === 0) {
            renderList(listAgentFilter, searchTerm);
          } else {
            const matches: any[] = listAgentFilter?.filter((it) =>
              it?.value?.toLowerCase().includes(searchTerm?.toLowerCase()),
            );
            renderList(matches, searchTerm);
          }
        },
        // blotName: "styled-mention",
      },
    }),
    [listAgentFilter],
  );
  return { moduleConfig, inputFileRef };
};

export default useModuleTextEditor;
