import { useRef } from "react";
import TodoListItem, { TodoListItemProps } from "./todo-list-item";
import { ItemTypes } from "@/lib/constants";
import { Draggable } from "@hello-pangea/dnd";
import classNames from "classnames";
import * as React from "react";

export type ScheduleIndex = {
  dayIndex: number;
  hourIndex: number;
};

interface DragItem {
  id: string;
  type: string;
  scheduleIndex: ScheduleIndex;
}

type DraggableItemProps = {
  id: string;
  index: number;
  scheduleIndex: ScheduleIndex;
} & TodoListItemProps;

export const DraggableItem = (props: DraggableItemProps) => {
  const { id, scheduleIndex, onUpdate, description, hours, status } = props;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Draggable draggableId={id} index={scheduleIndex.hourIndex}>
      {(provided, snapshot) => {
        return (
          <div
            className={classNames(
              "py-4 rounded-md",
              snapshot.isDragging ? "bg-gray-200" : "bg-white"
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TodoListItem
              onUpdate={onUpdate}
              id={id}
              index={scheduleIndex.hourIndex}
              description={description}
              hours={hours}
              status={status}
            />
          </div>
        );
      }}
    </Draggable>
  );
};
