import Head from "next/head";
import { Children, useState } from "react";
import TodoList from "@/components/todo-list";
import Schedule from "@/components/schedule";
import * as React from "react";

type TabProps = {
  name: string;
  value: string;
  component: React.ReactNode;
};

export default function TodoListPage() {
  return (
    <>
      <Head>
        <title>Todo List</title>
      </Head>
      <div className="w-full">
        <TodoList />
      </div>
    </>
  );
}
