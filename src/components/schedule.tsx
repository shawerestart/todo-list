"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TodoListItem from "./todo-list-item";
import { groupTodosByHours, timeToCalendarTime } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { DraggableItem, ScheduleIndex } from "./draggable-item";
import update from "immutability-helper";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import ScheduleArea from "./schedule-area";
import { MAX_HOUR } from "@/lib/constants";
import { useGlobalState } from "@/pages/_app";

const Schedule = () => {
  const [scheduleList, setScheduleList] = useState<TodoAPI.Todo[][]>([]);

  const [count, setCount] = useGlobalState("count");

  const getScheduleList = async () => {
    const res = await fetch("/api/schedule", {
      method: "GET",
    });
    const list = await res.json();
    setScheduleList(list);
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
    });
  };

  const updateTodo = async (id: string, data: TodoAPI.UpdateTodoDto) => {
    const res = await fetch(`/api/todo/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const updatedDto = await res.json();
    return updatedDto;
  };

  const updateLocalScheduleList = (data: TodoAPI.Todo) => {
    const newList = scheduleList.map((schedule) => {
      return schedule.map((todo) => {
        if (todo.id === data.id) {
          return data;
        }
        return todo;
      });
    });
    // if total hours over max hours, regroup all tasks
    let regroup = false;
    newList.map((item) => {
      const total = item.reduce((acc, e) => acc + e.hours, 0);
      if (total > MAX_HOUR) {
        regroup = true;
      }
      if (total === 0) {
        regroup = true;
      }
    });
    if (regroup) {
      setScheduleList(groupTodosByHours(newList.flat()));
      updateSchedule(groupTodosByHours(newList.flat()));
    } else {
      setScheduleList(newList);
      updateSchedule(newList);
    }
  };

  const updateSchedule = async (list: TodoAPI.Todo[][]) => {
    const schedulesRelations = list.map((schedules) => {
      return schedules.map((todo) => {
        return todo.id;
      });
    });
    await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify(schedulesRelations),
    });
  };

  const onUpdate = async (id: string, data: TodoAPI.UpdateTodoDto) => {
    if (data.hours === 0) {
      await deleteTodo(id);
      getScheduleList();
    } else {
      const res = await updateTodo(id, data);
      if (res) {
        if (data.hours) {
          updateLocalScheduleList(res);
        }
        if (data.description) {
          updateLocalScheduleList(res);
        }
        if (data.status !== undefined) {
          updateLocalScheduleList(res);
          // for animation
          setTimeout(() => {
            getScheduleList();
          }, 500);
        }
      }
    }
  };

  useEffect(() => {
    setCount(scheduleList?.[0]?.length || 0);
  }, [scheduleList]);

  useEffect(() => {
    getScheduleList();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) {
      return null;
    }

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null;
    }

    // Set start and end variables
    const start = scheduleList[Number(source.droppableId)];
    const end = scheduleList[Number(destination.droppableId)];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.filter(
        (_: any, idx: number) => idx !== source.index
      );
      // Then insert the item at the right location
      newList.splice(destination.index, 0, start[source.index]);

      const newSchduleList = update(scheduleList, {
        [Number(source.droppableId)]: {
          $set: newList,
        },
      });
      setScheduleList(newSchduleList);
      updateSchedule(newSchduleList);
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.filter(
        (_: any, idx: number) => idx !== source.index
      );
      // Make a new end list array
      const newEndList = [...end];

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start[source.index]);

      // check if new end list working hours over 8 hours
      const total = newEndList
        .map((todo) => todo.hours)
        .reduce((acc, curr) => acc + curr, 0);

      if (total > MAX_HOUR) {
        return null;
      }
      // Update the state
      if (newStartList.length > 0) {
        const newSchduleList = update(scheduleList, {
          [Number(source.droppableId)]: {
            $set: newStartList,
          },
          [Number(destination.droppableId)]: {
            $set: newEndList,
          },
        });
        setScheduleList(newSchduleList);
        updateSchedule(newSchduleList);
      } else {
        const newSchduleList = update(scheduleList, {
          $splice: [[Number(source.droppableId), 1]],
          [Number(destination.droppableId)]: {
            $set: newEndList,
          },
        });
        setScheduleList(newSchduleList);
        updateSchedule(newSchduleList);
      }

      return null;
    }
  };

  return (
    <div className="">
      <div className="h-[calc(100vh-82px)] overflow-y-auto">
        {/* title */}
        <div className="px-4 pt-8 text-2xl text-left">Schedule</div>
        <DragDropContext onDragEnd={onDragEnd}>
          {scheduleList.map((schedule, index) => {
            return (
              <ScheduleArea
                key={index}
                index={index}
                schedule={schedule}
                onUpdate={onUpdate}
              />
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Schedule;
