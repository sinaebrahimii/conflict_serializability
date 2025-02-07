import { useRef, useEffect, ReactNode } from "react";
import React from "react";
import { FaDiceFive, FaPlusCircle } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";

interface DialogFormProps {
  buttonText: string;
  buttonClassName?: string;
  children: ReactNode;
  form_number: number;
  t_id?: string;
  total_ops?: number;
}
interface ManualFormChildProps {
  closeDialog?: () => void;
}

interface DialogFormChildProps {
  closeDialog: () => void;
}
interface OperationFormChildProps {
  closeDialog: () => void;
  transaction_id?: string;
  total_operations?: number;
}

const DialogForm = ({
  buttonText,
  buttonClassName,
  children,
  form_number,
  total_ops,
  t_id,
}: DialogFormProps) => {
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
    <div className="p-6 mx-auto">
      <button
        onClick={openDialog}
        className={
          buttonClassName ||
          "bg-baby-blue text-gray-950 px-4 py-2 rounded hover:scale-105"
        }
      >
        {buttonText}
        {form_number === 2 && (
          <span>
            {" "}
            <FaPlusCircle />
          </span>
        )}
        {form_number === 1 && (
          <span>
            {" "}
            <FaDiceFive />
          </span>
        )}
        {form_number === 3 && (
          <span>
            {" "}
            <FaGears />
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="w-1/2 max-w-2xl p-6 bg-gray-900 rounded-lg shadow-lg mx-auto"
      >
        {/* Render children and pass closeDialog as a prop */}
        {form_number === 1 &&
          React.Children.map(children, (child) => {
            if (React.isValidElement<DialogFormChildProps>(child)) {
              return React.cloneElement(child, { closeDialog });
            }
            return child;
          })}
        {form_number === 2 &&
          React.Children.map(children, (child) => {
            if (React.isValidElement<OperationFormChildProps>(child)) {
              return React.cloneElement(child, {
                transaction_id: t_id,
                total_operations: total_ops,
                closeDialog,
              });
            }
            return child;
          })}
        {form_number === 3 &&
          React.Children.map(children, (child) => {
            if (React.isValidElement<ManualFormChildProps>(child)) {
              return React.cloneElement(child, {
                closeDialog,
              });
            }
            return child;
          })}
      </dialog>
    </div>
  );
};

export default DialogForm;
