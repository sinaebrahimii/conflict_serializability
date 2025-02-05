import { useRef, useEffect } from "react";
import { RandomScheduleForm } from "./RandomScheduleForm";

const DialogForm = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  // Close dialog when clicking outside (on the backdrop)
  useEffect(() => {
    const dialogElement = dialogRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogElement && event.target === dialogElement) {
        closeDialog();
      }
    };

    dialogElement?.addEventListener("click", handleClickOutside);

    return () => {
      dialogElement?.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={openDialog}
        className="bg-baby-blue text-gray-950 px-4 py-2 rounded hover:scale-105 "
      >
        Generate Schedules
      </button>

      <dialog
        ref={dialogRef}
        className="w-1/2 max-w-2xl p-6 bg-gray-900 rounded-lg shadow-lg mx-auto"
      >
        <RandomScheduleForm closeDialog={closeDialog} />
      </dialog>
    </div>
  );
};

export default DialogForm;
