import { NextApiRequest, NextApiResponse } from "next";
import * as apiUtils from "../api.utils";
import * as utils from "@/lib/utils";
import handler from "../schedule";

describe("schedule handler", () => {
  it("should return scheduled todos on GET request", async () => {
    const req: Partial<NextApiRequest> = {
      method: "GET",
    };
    const res: Partial<NextApiResponse> = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockGetTodos = jest.spyOn(apiUtils, "getTodos").mockReturnValue([
      { id: "1", hours: 1, description: "Todo 1", status: false },
      { id: "2", hours: 1, description: "Todo 2", status: true },
      // ... other todos
    ]);
    const mockGetSchedules = jest
      .spyOn(apiUtils, "getSchedules")
      .mockReturnValue([]);
    const mockSetSchedules = jest.spyOn(apiUtils, "setSchedules");
    const mockGroupTodosByHours = jest
      .spyOn(utils, "groupTodosByHours")
      .mockReturnValue([
        [{ id: "1", hours: 1, description: "Todo 1", status: false }],
        // ... other grouped todos
      ]);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockGetTodos).toHaveBeenCalled();
    expect(mockGetSchedules).toHaveBeenCalled();
    expect(mockSetSchedules).toHaveBeenCalledWith([
      ["1"],
      // ... other schedule lists
    ]);
    expect(mockGroupTodosByHours).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      [
        { id: "1", hours: 1, description: "Todo 1", status: false },
        // ... other filtered todos
      ],
      // ... other filtered todo groups
    ]);
  });

  it("should set schedules on POST request", async () => {
    const req: Partial<NextApiRequest> = {
      method: "POST",
      body: JSON.stringify([["1"], ["2"]]), // ... other schedule lists]),
    };
    const res: Partial<NextApiResponse> = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockSetSchedules = jest
      .spyOn(apiUtils, "setSchedules")
      .mockImplementation(() => {});
    const mockGetSchedules = jest
      .spyOn(apiUtils, "getSchedules")
      .mockReturnValue([
        ["1"],
        ["2"],
        // ... other schedules
      ]);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockSetSchedules).toHaveBeenCalledWith([["1"], ["2"]]);
    expect(mockGetSchedules).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalledWith([["1"], ["2"]]);
  });
});
