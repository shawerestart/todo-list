import { Icon } from "@iconify/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MAX_HOUR, MIN_HOUR } from "@/lib/constants";
import { Input } from "@material-tailwind/react";
import ConfirmDeleteDialog from "./confirm-delete-dialog";
import * as React from "react";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  showToolTip?: boolean;
};

const NumberInput = forwardRef((props: NumberInputProps, ref) => {
  const { onChange, value, min = MIN_HOUR, showToolTip = false } = props;

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const onButtonClick = (value: number) => {
    if (value > MAX_HOUR) {
      onChange(MAX_HOUR);
      return;
    }
    if (value > min) {
      onChange(value);
      return;
    }
    setConfirmDialogOpen(true);
  };

  const onDialogConfirm = () => {
    onChange(min);
    setConfirmDialogOpen(false);
  };

  const onDialogCancel = () => {
    setConfirmDialogOpen(false);
  };

  const onInputChange = (value: number) => {
    onChange(value);
  };

  const onInputBlur = () => {
    if (value > MAX_HOUR) {
      onChange(MAX_HOUR);
      return;
    }
    if (value < min) {
      onChange(min);
      return;
    }
  };

  return (
    <div className="flex flex-row items-center">
      <Icon
        className="text-2xl cursor-pointer mr-2 active:text-slate-500"
        icon="ion:remove"
        onClick={() => onButtonClick(value - 1)}
      />
      <div className="!w-12 h-8">
        <Input
          containerProps={{
            className: "!w-12 h-8 !min-w-[48px]",
          }}
          className="!px-1 !py-0.5 text-center"
          label="hours"
          type={"number"}
          variant="outlined"
          value={value}
          onChange={(event) => onInputChange(+event.target.value)}
          onBlur={() => onInputBlur()}
        />
      </div>
      <Icon
        className="text-2xl cursor-pointer ml-2 active:text-slate-500"
        icon="ion:add"
        onClick={() => onButtonClick(value + 1)}
      />
      {showToolTip && confirmDialogOpen && (
        <ConfirmDeleteDialog
          onConfirm={onDialogConfirm}
          onCancel={onDialogCancel}
        />
      )}
    </div>
  );
});

export default NumberInput;
