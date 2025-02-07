import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOperation } from "../utils/api";

interface TransactionFormProps {
  closeDialog?: () => void;
  transaction_id: string;
  total_operations: number;
}

type FormValues = {
  method: "w" | "r";
  variable: string;
};

const OperationForm = ({
  closeDialog,
  transaction_id,
  total_operations,
}: TransactionFormProps) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({
      order,
      method,
      variable,
      transaction_id,
    }: {
      order: string;
      method: "r" | "w";
      variable: string;
      transaction_id: string;
    }) => createOperation(order, method, variable, transaction_id),
    onSuccess: () => {
      // Invalidate the 'schedules' query to refetch data
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      console.log("operation manual created");
    },
    onError: (error) => {
      console.error("Error moving operation:", error);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    mutate({
      order: (total_operations + 1) as unknown as string,
      transaction_id: transaction_id,
      method: data.method,
      variable: data.variable,
    });
    console.log();
    closeDialog && closeDialog();
  };

  return (
    <div className="text-gray-200 bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <h2 className="text-xl font-semibold">Add Operation To Transaction</h2>
        {/* Method Input (w or r) */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="method"
            className="block text-sm font-medium text-gray-300"
          >
            Method
          </label>
          <input
            type="text"
            id="method"
            placeholder="w or r"
            {...register("method", {
              required: "Method is required",
              pattern: {
                value: /^[wr]$/,
                message: "Method must be 'w' or 'r'",
              },
            })}
            className="mt-1 w-[90px] text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.method && (
            <span className="text-red-400 text-sm block">
              {errors.method.message}
            </span>
          )}
        </div>

        {/* Variable Input (a-z, single character) */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="variable"
            className="block text-sm font-medium text-gray-300"
          >
            Variable
          </label>
          <input
            placeholder="a-z"
            type="text"
            id="variable"
            {...register("variable", {
              required: "Variable is required",
              pattern: {
                value: /^[a-z]$/,
                message: "Variable must be a single character (a-z)",
              },
            })}
            className="mt-1 w-[90px] text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.variable && (
            <span className="text-red-400 text-sm block">
              {errors.variable.message}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex mx-auto justify-center space-x-4 mt-7">
          <button
            type="button"
            onClick={closeDialog}
            className="hover:text-gray-100 px-4 py-2 rounded bg-gray-800 text-red-400 hover:bg-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="hover:text-gray-950 px-4 py-2 rounded bg-gray-800 text-baby-blue hover:bg-baby-blue"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default OperationForm;
