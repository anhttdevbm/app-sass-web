import { memo, useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

const Drop = ({ id, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId={id}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: 1 }}
            {...props}
          >
            {props.children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default memo(Drop);
