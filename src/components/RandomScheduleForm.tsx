import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRandomTransactionData } from "../utils/api";
interface RandomScheduleFormProps {
  closeDialog: () => void;
}

type FormValues = {
  transactions: number;
  variables: number;
  transaction_length: number;
};

export const RandomScheduleForm = ({
  closeDialog,
}: RandomScheduleFormProps) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({
      trNum,
      varNum,
      trLen,
    }: {
      trNum: number;
      varNum: number;
      trLen: number;
    }) => postRandomTransactionData(trNum, trLen, varNum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSchedules"] });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    mutate({
      trNum: data.transactions,
      trLen: data.transaction_length,
      varNum: data.variables,
    });
    console.log("Form data:");
    closeDialog();
  };

  return (
    <div className="text-gray-200 bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <h2 className="text-xl font-semibold">Generate Random Schedules</h2>

        {/* Number of Transactions Input */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="transactions"
            className="block text-sm font-medium text-gray-300"
          >
            Number of Transactions
          </label>
          <input
            type="number"
            id="transactions"
            {...register("transactions", {
              required: true,
              min: 1,
              max: 8,
              valueAsNumber: true,
            })}
            className="mt-1 w-[90px] text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.transactions && (
            <span className="text-red-400 text-sm block">
              Must be between 1 and 8
            </span>
          )}
        </div>

        {/* Number of Variables Input */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="variables"
            className="block text-sm font-medium text-gray-300"
          >
            Number of Variables
          </label>
          <input
            type="number"
            id="variables"
            {...register("variables", {
              required: true,
              min: 1,
              max: 8,
              valueAsNumber: true,
            })}
            className="mt-1 w-[90px] text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.variables && (
            <span className="text-red-400 text-sm block">
              Must be between 1 and 8
            </span>
          )}
        </div>

        {/* Transactions Length Input */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="transaction_length"
            className="block text-sm font-medium text-gray-300"
          >
            Transaction Length
          </label>
          <input
            type="number"
            id="transaction_length"
            {...register("transaction_length", {
              required: true,
              min: 1,
              max: 8,
              valueAsNumber: true,
            })}
            className="mt-1 w-[90px] text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.transaction_length && (
            <span className="text-red-400 text-sm block">
              Must be between 1 and 8
            </span>
          )}
        </div>

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
