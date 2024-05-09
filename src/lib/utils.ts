import dayjs, { Dayjs } from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const timeToCalendarTime = (time: Dayjs) => {
  // @ts-ignore
  const formattedTime = dayjs(time).calendar(null, {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "MMM D, YYYY",
    lastDay: "MMM D, YYYY",
    lastWeek: "MMM D, YYYY",
    sameElse: "MMM D, YYYY",
  });
  return formattedTime;
};

const groupTodosByHours = (todos: TodoAPI.Todo[]): TodoAPI.Todo[][] => {
  const groupedTodos: TodoAPI.Todo[][] = [];
  let currentGroup: TodoAPI.Todo[] = [];

  todos.forEach((todo: TodoAPI.Todo, index) => {
    // 如果当前组的总小时数加上当前todo的小时数不超过8小时，则添加到当前组
    if (currentGroup.reduce((acc, t) => acc + t.hours, 0) + todo.hours <= 8) {
      currentGroup.push(todo);
    } else {
      // 否则，将当前组添加到分组数组中，并开始一个新的组
      if (currentGroup.length > 0) {
        groupedTodos.push(currentGroup);
      }
      currentGroup = [todo];
    }
  });

  // 将最后一个组添加到分组数组中，如果它不为空
  if (currentGroup.length > 0) {
    groupedTodos.push(currentGroup);
  }
  return groupedTodos;
};

export { groupTodosByHours, timeToCalendarTime };
