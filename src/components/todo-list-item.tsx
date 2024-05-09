"use client";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import NumberInput from "./number-input";
import classNames from "classnames";
import { useDebounce } from "use-debounce";

export type TodoListItemProps = {
  id: string;
  index: number;
  icon?: React.ReactNode;
  description: string;
  hours: number;
  status: boolean;
  onUpdate: (id: string, data: TodoAPI.UpdateTodoDto) => void;
};

export default function TodoListItem(props: TodoListItemProps) {
  const { id, index, icon, description, hours, status, onUpdate } = props;
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentHours, setCurrentHours] = useState<number>(hours);
  const [debounceHours] = useDebounce(currentHours, 500, { leading: false });
  const [animate, setAnimate] = useState<boolean>(false);

  const [content, setContent] = useState<string>(description);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onTaskContentClick = () => {
    setIsEdit(true);
  };

  const onAnimationEnd = () => {
    setAnimate(false);
    onUpdate(id, {
      status: !status,
    });
  };

  const onBlur = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerText);
    }
    setIsEdit(false);
  };

  useEffect(() => {
    if (!isEdit && content !== description) {
      onUpdate(id, {
        description: content,
      });
    }
  }, [isEdit, content]);

  // api debounce
  useEffect(() => {
    if (debounceHours !== hours) {
      onUpdate(id, {
        hours: debounceHours,
      });
    }
  }, [debounceHours, hours]);

  return (
    <div className="w-full py-2 px-4 flex flex-row items-center ">
      {/* checkmark */}
      {icon || (
        <Icon
          className={classNames(
            "size-8",
            animate && "animate__animated animate__rubberBand animate__faster"
          )}
          icon={status ? "ion:checkmark-circle" : "ion:ellipse-outline"}
          onClick={() => {
            setAnimate(true);
          }}
          onAnimationEnd={onAnimationEnd}
        />
      )}
      <div
        ref={contentRef}
        className={classNames(
          "flex flex-row flex-1 break-all mx-2 rounded-sm px-2 py-1",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "ring-gray-800"
        )}
        contentEditable={isEdit}
        suppressContentEditableWarning={true}
        onClick={onTaskContentClick}
        onBlur={() => onBlur()}
      >
        {content || "New Task"}
      </div>
      {/* input */}
      <NumberInput
        value={currentHours}
        onChange={(value) => setCurrentHours(value)}
        showToolTip={true}
      />
    </div>
  );
}
