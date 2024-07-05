import { Stack } from "@mui/material";
import { Button, Checkbox, IconButton, Text } from "components/shared";
import MoveDotIcon from "icons/MoveDotIcon";
import PlusIcon from "icons/PlusIcon";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";

const Drag = ({ id, index, checked, onChange, ...props }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...props}>
            <Stack
              direction="row"
              alignItems="center"
              height={48}
              pl={{ xs: 1, md: 2 }}
              spacing={{ xs: 0.5, sm: 1 }}
            >
              <Checkbox checked={checked} onChange={onChange} />
              <IconButton noPadding {...provided.dragHandleProps}>
                <MoveDotIcon fontSize="medium" sx={{ color: "grey.A200" }} />
              </IconButton>
            </Stack>

            {props.children}
          </div>
        );
      }}
    </Draggable>
  );
};

export default memo(Drag);
