import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule } from "../utils/api";
interface ManualFormProps {
  closeDialog?: () => void;
}

type FormValues = {
  transactions: number;
  schedule_name: string;
};

const ManualForm = ({ closeDialog }: ManualFormProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({
      name,
      transaction_num,
    }: {
      name: string;
      transaction_num: number;
    }) => createSchedule(name, transaction_num),
    onSuccess: () => {
      // Invalidate the 'schedules' query to refetch data
      queryClient.invalidateQueries({ queryKey: ["allSchedules"] });
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
    mutate({ name: data.schedule_name, transaction_num: data.transactions });
    console.log("Form data:", data);
    closeDialog && closeDialog();
  };

  return (
    <div className="text-gray-200 bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <h2 className="text-xl font-semibold">Create Schedule</h2>

        {/* Transactions Input (Number, minimum 1) */}
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
            placeholder="Enter a number"
            {...register("transactions", {
              required: "Number of transactions is required",
              min: {
                value: 1,
                message: "Must be at least 1",
              },
              valueAsNumber: true,
            })}
            className="mt-1 w-full text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.transactions && (
            <span className="text-red-400 text-sm block">
              {errors.transactions.message}
            </span>
          )}
        </div>

        {/* Schedule Name Input (String) */}
        <div className="w-1/2 mx-auto space-y-3">
          <label
            htmlFor="schedule_name"
            className="block text-sm font-medium text-gray-300"
          >
            Schedule Name
          </label>
          <input
            type="text"
            id="schedule_name"
            placeholder="Enter schedule name"
            {...register("schedule_name", {
              required: "Schedule name is required",
            })}
            className="mt-1 w-full text-center mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-baby-blue focus:border-baby-blue"
          />
          {errors.schedule_name && (
            <span className="text-red-400 text-sm block">
              {errors.schedule_name.message}
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

export default ManualForm;
