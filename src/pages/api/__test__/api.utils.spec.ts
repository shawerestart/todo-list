import { onTodoUpdate } from "../api.utils";
import fs from "fs";
import path from "path";

jest.mock("fs", () => {
  return {
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

jest.mock("path", () => {
  return {
    join: jest.fn(),
  };
});

describe("onTodoUpdate", () => {
  const MAX_HOUR = 8;
  const mockGetTodos = jest.fn();
  const mockSetSchedules = jest.fn();
  const mockIsScheduleExist = jest.fn();

  beforeAll(() => {
    jest.resetModules();

    // Mock path.join
    (path.join as jest.Mock).mockImplementation((...args: string[]) =>
      args.join("/")
    );

    // Mock fs.readFileSync and fs.writeFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([]));
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    // Mock getTodos, setSchedules and isScheduleExist
    mockGetTodos.mockReturnValue([]);
    mockSetSchedules.mockImplementation(() => {});
    mockIsScheduleExist.mockReturnValue(false);

    // Re-require the module to apply mocks
    jest.doMock(
      "../api.utils",
      () => {
        return {
          onTodoUpdate: jest.requireActual("../api.utils").onTodoUpdate,
          getTodos: mockGetTodos,
          setSchedules: mockSetSchedules,
          isScheduleExist: mockIsScheduleExist,
        };
      },
      { virtual: true }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not add the todo to schedules if it already exists", async () => {
    // Arrange
    const todo = {
      id: "1",
      hours: 10,
      description: "Test Task",
      status: false,
    };
    (mockIsScheduleExist as jest.Mock).mockReturnValue(true);

    // Act
    await onTodoUpdate(todo);

    // Assert
    expect(mockSetSchedules).not.toHaveBeenCalled();
  });
});
