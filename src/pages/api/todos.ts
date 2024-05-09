import type { NextApiRequest, NextApiResponse } from "next";
import { getTodos } from "./api.utils";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const todos = getTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(200).json([]);
    }
  }
}
