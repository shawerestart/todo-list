import type { NextApiRequest, NextApiResponse } from "next";
import { getSchedules, getTodos, setSchedules } from "./api.utils";
import { groupTodosByHours } from "@/lib/utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const todos = getTodos();
    let scheduleList: string[][] = [];
    const schedules = getSchedules();
    if (schedules.length === 0) {
      scheduleList = groupTodosByHours(todos).map((schdule) => {
        return schdule.map((todo) => {
          return todo.id;
        });
      });
      setSchedules(scheduleList);
    } else {
      scheduleList = schedules;
    }
    const returnList = scheduleList
      .map((schdule) => {
        return schdule
          .map((todoId) => {
            return todos.find((item) => item.id === todoId && !item.status);
          })
          .filter((item) => item !== undefined);
      })
      .filter(
        (item) => item !== undefined && item.length > 0
      ) as TodoAPI.Todo[][];

    res.status(200).json(returnList);
  }

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    setSchedules(data);
    res.status(200).json(getSchedules());
  }
}
