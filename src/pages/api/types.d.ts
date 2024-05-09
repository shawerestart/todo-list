declare namespace TodoAPI {
  type CreateTodoDto = {
    description: string;
    hours: number;
  };
  type UpdateTodoDto = Partial<TodoAPI.Todo>;
  type Todo = {
    id: string;
    description: string;
    status: boolean;
    hours: number;
  };

  type UpdateScheduleDto = string[][];
}
