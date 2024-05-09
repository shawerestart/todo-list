import dayjs from "dayjs";
import { timeToCalendarTime, groupTodosByHours } from "../utils";

describe("timeToCalendarTime", () => {
  it("should format the given time to calendar time", () => {
    const time = dayjs("2023-03-15T12:00:00Z");
    const expectedTime = "Mar 15, 2023";
    const formattedTime = timeToCalendarTime(time);

    expect(formattedTime).toBe(expectedTime);
  });

  it("should return 'Today' if the given time is today", () => {
    const time = dayjs();
    const expectedTime = "Today";
    const formattedTime = timeToCalendarTime(time);

    expect(formattedTime).toBe(expectedTime);
  });

  it("should return 'Tomorrow' if the given time is tomorrow", () => {
    const time = dayjs().add(1, "day");
    const expectedTime = "Tomorrow";
    const formattedTime = timeToCalendarTime(time);

    expect(formattedTime).toBe(expectedTime);
  });

  // Add more test cases for other conditions
});

describe("groupTodosByHours", () => {
  it("should group todos by hours", () => {
    const todos = [
      {
        id: "1",
        description: "Todo 1",
        hours: 4,
        status: false,
      },
      {
        id: "2",
        description: "Todo 2",
        hours: 2,
        status: false,
      },
      {
        id: "3",
        description: "Todo 3",
        hours: 3,
        status: false,
      },
      {
        id: "4",
        description: "Todo 4",
        hours: 4,
        status: false,
      },
    ];

    const expectedGroups = [
      [
        {
          id: "1",
          description: "Todo 1",
          hours: 4,
          status: false,
        },
        {
          id: "2",
          description: "Todo 2",
          hours: 2,
          status: false,
        },
      ],
      [
        {
          id: "3",
          description: "Todo 3",
          hours: 3,
          status: false,
        },
        {
          id: "4",
          description: "Todo 4",
          hours: 4,
          status: false,
        },
      ],
    ];

    const groupedTodos = groupTodosByHours(todos);

    expect(groupedTodos).toEqual(expectedGroups);
  });

  // Add more test cases for different scenarios
});
