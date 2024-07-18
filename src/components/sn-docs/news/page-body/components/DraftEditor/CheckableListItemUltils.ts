import { ContentBlock, EditorState } from "draft-js";
import { CHECKABLE_LIST_ITEM } from "../../constants/draft.constants";
import { adjustBlockDepth, mergeBlockDataByKey } from "draft-js-modifiers";
import { PropsCheckableListItem } from "./CheckableListItem";

export type CheckableListItemBlock = {
  component: React.ComponentType<PropsCheckableListItem>;
  props: Object;
};

function toggleChecked(
  editorState: EditorState,
  block: ContentBlock,
): EditorState {
  return mergeBlockDataByKey(editorState, block.getKey(), {
    checked: !block.getData().get("checked"),
  });
}

function onTab(
  event: React.MouseEvent<HTMLButtonElement>,
  editorState: EditorState,
  maxDepth: number,
): EditorState {
  const selection = editorState.getSelection();
  const key = selection.getAnchorKey();
  if (key !== selection.getFocusKey()) {
    return editorState;
  }

  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(key);
  const type = block.getType();
  if (type !== CHECKABLE_LIST_ITEM) {
    return editorState;
  }

  event.preventDefault();

  // Only allow indenting one level beyond the block above, and only if
  // the block above is a list item as well.
  const blockAbove = content.getBlockBefore(key);
  if (!blockAbove) {
    return editorState;
  }

  const typeAbove = blockAbove.getType();
  if (typeAbove !== CHECKABLE_LIST_ITEM) {
    return editorState;
  }

  const depth = block.getDepth();
  if (!event.shiftKey && depth === maxDepth) {
    return editorState;
  }

  maxDepth = Math.min(blockAbove.getDepth() + 1, maxDepth);

  return adjustBlockDepth(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    event.shiftKey ? -1 : 1,
    maxDepth,
  );
}

export { toggleChecked, onTab };
