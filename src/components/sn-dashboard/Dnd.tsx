"use client";

import React, { memo, useState } from "react";
import { Stack } from "@mui/material";
import {
  BeforeCapture,
  DragDropContext,
  DragStart,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import CaretIcon from "icons/CaretIcon";

type DnDProps = {};

const DATA = [
  {
    id: "TL01",
    name: "TL01",
    tasks: [
      {
        id: "TL01-T1",
        name: "TL01-T1",
        subTasks: [
          {
            id: "TL01-T1-ST1",
            name: "TL01-T1-ST1",
          },
          {
            id: "TL01-T1-ST2",
            name: "TL01-T1-ST2",
          },
        ],
      },
      { id: "TL01-T2", name: "TL01-T2" },
      { id: "TL01-T3", name: "TL01-T3" },
    ],
  },
  {
    id: "TL02",
    name: "TL02",
    tasks: [
      {
        id: "TL02-T1",
        name: "TL02-T1",
        subTasks: [
          {
            id: "TL02-T1-ST1",
            name: "TL02-T1-ST1",
          },
          {
            id: "TL02-T1-ST2",
            name: "TL02-T1-ST2",
          },
        ],
      },
      {
        id: "TL02-T2",
        name: "TL02-T2",
        subTasks: [
          {
            id: "TL02-T2-ST1",
            name: "TL02-T2-ST1",
          },
          {
            id: "TL02-T2-ST2",
            name: "TL02-T2-ST2",
          },
        ],
      },
      { id: "TL02-T3", name: "TL02-T3" },
    ],
  },
];

const DnD = (props: DnDProps) => {
  const [sourceId, setSourceId] = useState<string | undefined>();

  const onDragEnd = (result: DropResult) => {
    //
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {DATA.map((taskList) => (
        <Droppable key={taskList.id} droppableId={taskList.id}>
          {(taskListDropProvided, taskListDropSnapshot) => {
            return (
              <div
                ref={taskListDropProvided.innerRef}
                {...taskListDropProvided.droppableProps}
                style={getTaskListStyle(taskListDropSnapshot.isDraggingOver)}
              >
                <h5 style={{ paddingLeft: 20 }}>{taskList.name}</h5>
                {taskList.tasks.map((task, indexTask) => (
                  <Draggable
                    index={indexTask}
                    key={task.id}
                    draggableId={task.id}
                  >
                    {(taskProvided, taskSnapshot) => {
                      return (
                        <div
                          ref={taskProvided.innerRef}
                          {...taskProvided.draggableProps}
                          {...taskProvided.dragHandleProps}
                          style={getItemStyle(
                            task.id === sourceId,
                            taskProvided.draggableProps.style,
                          )}
                        >
                          <span>
                            {task.name}
                            <CaretIcon
                              onClick={() => {
                                setSourceId(task.id);
                              }}
                            />
                          </span>
                          {sourceId !== task.id && (
                            <Droppable droppableId={task.id}>
                              {(taskDropProvided, taskDropSnapshot) => {
                                return (
                                  <div
                                    ref={taskDropProvided.innerRef}
                                    {...taskDropProvided.droppableProps}
                                    style={getTaskStyle(
                                      taskDropSnapshot.isDraggingOver,
                                    )}
                                  >
                                    {task?.subTasks?.map((subTask) => (
                                      <div
                                        key={subTask.id}
                                        style={{
                                          paddingLeft: 20,
                                          border: "1px solid red",
                                          marginTop: 8,
                                          marginBottom: 8,
                                          minHeight: 50,
                                        }}
                                      >
                                        {subTask.name}
                                      </div>
                                    ))}
                                    {taskDropProvided.placeholder}
                                  </div>
                                );
                              }}
                            </Droppable>
                          )}
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {taskListDropProvided.placeholder}
              </div>
            );
          }}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default memo(DnD);

const getTaskListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "green" : "lightblue",
  minHeight: 50,
  border: "1px solid yellow",
  marginTop: 8,
  marginBottom: 8,
});
const getTaskStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "yellow" : "purple",
});

const getItemStyle = (isDragging: boolean, draggableStyle) => {
  return {
    userSelect: "none",
    background: isDragging ? "red" : "grey",
    minHeight: 50,
    border: "1px solid green",
    marginTop: 8,
    marginBottom: 8,
    overflow: "hidden",
    // styles we need to apply on draggables
    ...draggableStyle,
  };
};
