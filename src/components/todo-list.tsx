"use client";
import React, {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TodoListItem from "./todo-list-item";
import NumberInput from "./number-input";
import { MIN_HOUR, DEFAULT_HOUR } from "@/lib/constants";
import { Button, Textarea } from "@material-tailwind/react";
import { useGlobalState } from "@/pages/_app";

export default function TodoList() {
  const todoListEndRef = useRef<any>();

  const [count, setCount] = useGlobalState("count");

  const [todoList, setTodoList] = useState<TodoAPI.Todo[]>([]);

  const [content, setContent] = useState<string>("");

  const [hour, setHour] = useState<number>(DEFAULT_HOUR);

  const [loading, setLoading] = useState<boolean>(false);

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onHoursChange = (value: number) => {
    setHour(value);
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
    });
  };

  const addTodo = async () => {
    setLoading(true);
    // const res = await TodoAPI.createTodo({
    //   description: content,
    //   hours: hour,
    // });
    const res = await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({
        description: content,
        hours: hour,
      }),
    });

    const data = await res.json();

    getTodoList();
    setContent("");
    todoListEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setLoading(false);
  };

  const updateTodo = async (id: string, data: TodoAPI.UpdateTodoDto) => {
    // const res = await TodoAPI.updateTodo(id, data);
    const res = await fetch(`/api/todo/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    return resData;
  };

  const getTodoList = async () => {
    // const list = await TodoAPI.list();
    const res = await fetch("/api/todos", {
      method: "get",
    });
    const list = await res.json();
    setTodoList(list);
    getScheduleCount();
  };

  const getScheduleCount = async () => {
    const res = await fetch("/api/schedule", {
      method: "GET",
    });
    const list = await res.json();
    setCount(list?.[0]?.length || 0);
  };

  const onUpdate = async (id: string, data: TodoAPI.UpdateTodoDto) => {
    if (data.hours === 0) {
      await deleteTodo(id);
    } else {
      await updateTodo(id, data);
    }
    getTodoList();
  };

  useEffect(() => {
    getTodoList();
  }, []);

  const totalHours = useMemo(() => {
    if (todoList && todoList.length > 0) {
      return todoList.reduce((prev, current) => {
        return prev + (!current.status ? current.hours : 0);
      }, 0);
    }
    return 0;
  }, [todoList]);

  const canAddTask = useMemo(() => {
    if (!content || content.length === 0) {
      return false;
    }
    if (hour < MIN_HOUR) {
      return false;
    }
    if (loading) {
      return false;
    }
    return true;
  }, [content, hour, loading]);

  return (
    <div className="">
      <div className="h-[calc(100vh-82px)] overflow-y-auto">
        {/* title */}
        <div className="px-4 pt-8 text-2xl text-left">To-do list</div>
        {/* todo list item */}
        {todoList.map((item, index) => {
          return (
            <TodoListItem
              key={item.id}
              index={index}
              id={item.id}
              description={item.description}
              hours={item.hours}
              status={item.status}
              onUpdate={onUpdate}
            />
          );
        })}
        <div
          ref={todoListEndRef}
          className="px-4 pt-4 pb-[140px] flex flex-row justify-between"
        >
          <div>Total Incomplete Task</div>
          <div>{totalHours} hours</div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner py-4">
        <div className="w-full py-2 px-4 flex flex-row items-end">
          <Textarea
            className="h-full break-all"
            value={content}
            onChange={onContentChange}
            label="New Task"
          />
          <div className="pl-4 mb-2">
            <NumberInput value={hour} onChange={onHoursChange} />
            <Button
              variant="filled"
              className="w-full mt-2"
              onClick={addTodo}
              disabled={!canAddTask}
              loading={loading}
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
