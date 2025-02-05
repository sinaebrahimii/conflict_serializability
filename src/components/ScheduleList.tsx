import { getSchedules } from "../utils/api";
import Schedule from "./Schedule";
import { useQuery } from "@tanstack/react-query";
import { checkTransactionsConflictSerializability } from "../utils/conflictSerialize";

const ScheduleList = () => {
  const { data } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  const iscfsz =
    data && checkTransactionsConflictSerializability(data.transactions);
  return (
    <>
      <h2
        className={`text-center  text-3xl ${
          iscfsz ? "text-green-600" : "text-red-600"
        }`}
      >
        {iscfsz ? "Conflict Serializable" : "Graph has cycle"}
      </h2>
      <div className="w-full flex justify-center mt-5 items-center gap-4">
        {data?.transactions.map((t, index) => {
          // Determine the next and previous schedules
          const nextItem =
            index < data.transactions.length - 1
              ? data.transactions[index + 1]
              : null;
          const prevItem = index > 0 ? data.transactions[index - 1] : null;
          const ops = t.operations.sort(
            (a, b) => parseInt(a.order) - parseInt(b.order)
          );

          return (
            <Schedule
              //passing the props down
              scheduleName={t.name}
              key={t.id}
              ops={ops}
              transactionId={t.id}
              last={data.transactions[data.transactions.length - 1].id}
              first={data.transactions[0].id}
              next={nextItem?.id} // Pass nextItem as a prop
              prev={prevItem?.id} // Pass prevItem as a prop
            />
          );
        })}
      </div>
    </>
  );
};

export default ScheduleList;
