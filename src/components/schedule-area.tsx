import { Draggable, Droppable } from "@hello-pangea/dnd";
import { DraggableItem, ScheduleIndex } from "./draggable-item";
import { timeToCalendarTime } from "@/lib/utils";
import dayjs from "dayjs";
import classNames from "classnames";

type ScheduleAreaProps = {
  index: number;
  schedule: TodoAPI.Todo[];
  onUpdate: (id: string, data: TodoAPI.UpdateTodoDto) => void;
};
const ScheduleArea = (props: ScheduleAreaProps) => {
  const { schedule, index, onUpdate } = props;
  return (
    <Droppable droppableId={index.toString()}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div
            className={classNames(
              "px-4 py-4 text-xl sticky top-0 bg-white shadow-sm"
            )}
            style={{
              zIndex: index + 5,
            }}
          >
            {timeToCalendarTime(dayjs().add(index, "day"))}
          </div>
          <div className="grid grid-cols-1 divide-y">
            {schedule.map((todo, j) => (
              <DraggableItem
                key={todo.id}
                id={todo.id}
                index={j}
                scheduleIndex={{
                  dayIndex: index,
                  hourIndex: j,
                }}
                description={todo.description}
                hours={todo.hours}
                status={todo.status}
                onUpdate={onUpdate}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default ScheduleArea;
