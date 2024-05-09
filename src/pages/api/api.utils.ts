import { MAX_HOUR } from "@/lib/constants";
import fs from "fs";
import path from "path";

const getTodoByIds = async (ids: string[]) => {
  return new Promise<TodoAPI.Todo[]>((resolve) => {
    const todos = getTodos();
    resolve(todos.filter((todo) => (ids || []).includes(todo.id)));
  });
};

const onTodoUpdate = async (data: TodoAPI.Todo) => {
  const schedules: string[][] = getSchedules();
  const todos = await getTodoByIds(schedules[schedules.length - 1]);
  const lastTotal = todos?.reduce((acc, curr) => acc + curr.hours, 0);
  if (isScheduleExist(data.id)) {
    return;
  }
  if (lastTotal + data.hours > MAX_HOUR || lastTotal === 0) {
    schedules.push([data.id]);
  } else {
    schedules[schedules.length - 1].push(data.id);
  }
  setSchedules(schedules);
};

const isScheduleExist = (id: string): boolean => {
  const filePath = path.join(process.cwd(), "./schdules.json");
  const schedulesData = fs.readFileSync(filePath, "utf8");
  const schedules: string[][] = JSON.parse(schedulesData);
  return !!schedules.flat().find((todoId) => todoId === id);
};

const getTodos = (): TodoAPI.Todo[] => {
  const filePath = path.join(process.cwd(), "./todos.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const setTodos = (todos: TodoAPI.Todo[]) => {
  const filePath = path.join(process.cwd(), "./todos.json");
  fs.writeFileSync(filePath, JSON.stringify(todos), "utf8");
};

const getSchedules = (): string[][] => {
  const filePath = path.join(process.cwd(), "./schdules.json");
  const schedulesData = fs.readFileSync(filePath, "utf8");
  const schedules: string[][] = JSON.parse(schedulesData);
  return schedules;
};

const setSchedules = (schedules: string[][]) => {
  const filePath = path.join(process.cwd(), "./schdules.json");
  fs.writeFileSync(filePath, JSON.stringify(schedules), "utf8");
};

export {
  onTodoUpdate,
  getTodoByIds,
  getTodos,
  setTodos,
  getSchedules,
  setSchedules,
};
