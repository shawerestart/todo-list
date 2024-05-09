import type { NextApiRequest, NextApiResponse } from "next";
import * as _ from "lodash";
import {
  getSchedules,
  getTodos,
  onTodoUpdate,
  setSchedules,
  setTodos,
} from "../api.utils";
// update todo
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const id = req.query.id;
      const body = JSON.parse(req.body);
      const todos = getTodos();
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        res.status(200).json(null);
      } else {
        const newTodo = {
          ...todos[todoIndex],
          ..._.omit(body, ["id"]),
        };
        todos[todoIndex] = newTodo;
        setTodos(todos);
        await onTodoUpdate(newTodo);
        res.status(200).json(newTodo);
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json(error);
    }
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    const todos = getTodos().filter((todo) => todo.id !== id);
    setTodos(todos);
    const schedules = getSchedules();
    const newSchedules = schedules
      .map((schduleIds) => {
        return schduleIds.filter((scheduleId) => scheduleId !== id);
      })
      .filter((schduleIds) => schduleIds.length > 0);
    setSchedules(newSchedules);
    res.status(200).json({ success: true });
  }
}
