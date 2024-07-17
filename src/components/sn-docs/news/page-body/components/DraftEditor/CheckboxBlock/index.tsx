import { Checkbox } from "@mui/material";
import { EditorState, Modifier, SelectionState } from "draft-js";
import { useCallback, useState } from "react";
export default function CheckboxBlockDraft(props) {
  const { block, contentState } = props;
  const text = block.getText();
  const [checked, setChecked] = useState(text.startsWith("[x]"));

  const handleToggle = useCallback(() => {
    const newText = checked ? "[ ] " : "[x] ";
    const newContentState = Modifier.replaceText(
      contentState,
      SelectionState.createEmpty(block.getKey()),
      newText + text.slice(4),
    );
    props.blockProps.onChange(
      EditorState.push(
        props.blockProps.getEditorState(),
        newContentState,
        "change-block-data",
      ),
    );
    setChecked(!checked);
  }, [checked, text, contentState, block, props.blockProps]);

  return (
    <div>
      <Checkbox checked={checked} onChange={handleToggle} />
      <span>{text.slice(4)}</span>
    </div>
  );
}
