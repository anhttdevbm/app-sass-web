import {
  ContentBlock,
  ContentState,
  DraftDecoratorType,
  SelectionState,
  EditorBlock,
} from "draft-js";
import type { List } from "immutable";
import type { BidiDirection } from "fbjs/lib/UnicodeBidiDirection";

type BlockProps = {
  onChangeChecked: () => void;
  checked: boolean;
};

export type PropsCheckableListItem = {
  contentState: ContentState;
  block: ContentBlock;
  customStyleMap: Object;
  customStyleFn: Function;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tree: List<any>;
  selection: SelectionState;
  decorator: DraftDecoratorType;
  forceSelection: boolean;
  direction: BidiDirection;
  blockStyleFn: Function;
  offsetKey: string;
  blockProps: BlockProps;
};

const CheckableListItem: React.FC<PropsCheckableListItem> = (props) => {
    const {
      offsetKey,
      blockProps: { onChangeChecked, checked },
    } = props;
  
    return (
      <div
        className={`checkable-list-item-block${checked ? " is-checked" : ""}`}
        data-offset-key={offsetKey}
      >
        <div
          className="checkable-list-item-block__checkbox"
          contentEditable={false}
          suppressContentEditableWarning
        >
          <input type="checkbox" checked={checked} onChange={onChangeChecked} />
        </div>
        <div className="checkable-list-item-block__text">
          <EditorBlock {...props} />
        </div>
      </div>
    );
  };

  export default CheckableListItem;
