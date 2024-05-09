import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { getTodos, onTodoUpdate, setTodos } from "./api.utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const newTodo = {
      ...body,
      id: v4(),
      status: false,
    };
    const todos = getTodos();
    todos.push(newTodo);
    setTodos(todos);
    await onTodoUpdate(newTodo);
    return res.status(200).json(newTodo);
  }
}
