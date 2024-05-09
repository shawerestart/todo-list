import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import * as React from "react";

type ConfirmDeleteDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {
  const { onConfirm, onCancel } = props;
  const handleOpen = () => {};
  return (
    <Dialog open={true} size={"xs"} handler={handleOpen}>
      <DialogHeader>Confirm delete?</DialogHeader>
      <DialogBody>The task will remove from the Todo list.</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => onCancel()}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={() => onConfirm()}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
