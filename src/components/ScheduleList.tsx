import { useQuery } from "@tanstack/react-query";
import { getAllSchedules } from "../utils/api";
import { useNavigate } from "react-router-dom";
import DialogForm from "./DialogForm";
import { RandomScheduleForm } from "./RandomScheduleForm";
import ManualForm from "./ManualForm";
const ScheduleList = () => {
  const { data: schedules } = useQuery({
    queryKey: ["allSchedules"],
    queryFn: getAllSchedules,
  });
  return (
    <div>
      <DialogForm
        buttonText="Gernerate Random Schedules"
        buttonClassName="bg-baby-blue text-gray-950 px-4 py-2 rounded hover:scale-105 flex justify-center items-center gap-2 mx-auto  w-[300px]"
        form_number={1}
      >
        {<RandomScheduleForm />}
      </DialogForm>
      <DialogForm
        buttonText="Gernerate Manual Schedules"
        buttonClassName="bg-mint-green text-gray-950 px-4  py-2 rounded hover:scale-105 flex justify-center items-center gap-2 mx-auto w-[300px] "
        form_number={3}
      >
        <ManualForm />
      </DialogForm>
      <ul className="space-y-5">
        {schedules
          ?.slice() // Avoid mutating original array
          .sort((a, b) => Number(b.id) - Number(a.id)) // Convert id to number and sort in descending order
          .map((sch) => (
            <Schedule
              key={sch.id}
              name={sch.name}
              variables={sch.variable_num}
              transactions={sch.transaction_num}
              id={sch.id}
              length={sch.transaction_len}
            />
          ))}
      </ul>
    </div>
  );
};

export default ScheduleList;

const Schedule = ({
  name,
  variables,
  transactions,
  length,
  id,
}: {
  name: string;
  variables: number;
  transactions: number;
  length: number;
  id: string;
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    // Navigate to the /schedules/:scheduleId route
    navigate(`/schedules/${id}`);
  };

  return (
    <li
      className="bg-gray-800 text-baby-blue rounded-md p-4 cursor-pointer hover:bg-gray-700 "
      onClick={handleClick}
    >
      <h4 className="font-semibold text-white mb-1.5 ">{name}</h4>

      <div className="flex justify-center gap-4">
        <p className="">Total Tranactions: {transactions}</p>
        <p className="">Total Variables: {variables}</p>
        <p className="">Transaction Random Length: {length}</p>
      </div>
    </li>
  );
};
