import { getSchedules } from "../utils/api";
import Transaction from "./Transaction";
import {
  Schedule as ScheduleT,
  Transaction as TransactionT,
} from "../utils/api";
import { useQuery } from "@tanstack/react-query";
import { checkTransactionsConflictSerializability } from "../utils/conflictSerialize";
import { useParams } from "react-router-dom";
import GraphComponent from "./GraphComponent";
function getTotalOperations(schedule: Readonly<ScheduleT>): number {
  return schedule.transactions.reduce(
    (total: number, transaction: Readonly<TransactionT>) =>
      total + transaction.operations.length,
    0
  );
}
const TransactionList = () => {
  const { scheduleId } = useParams();
  console.log(scheduleId);
  const { data } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => getSchedules(scheduleId),
  });
  const totalOps = data ? getTotalOperations(data) : 10;
  // const serializable =
  //   data && checkTransactionsConflictSerializability(data.transactions);
  const { serializable, graph } = data?.transactions
    ? checkTransactionsConflictSerializability(data.transactions)
    : { serializable: false, graph: { nodes: [], edges: [] } };
  return (
    <div>
      <h2
        className={`text-center  text-3xl ${
          serializable ? "text-green-600" : "text-red-600"
        }`}
      >
        {serializable ? "Conflict Serializable" : "Graph has cycle"}
      </h2>
      <div className="flex justify-center items-center">
        <div className="w-full flex-1 flex justify-center mt-5 items-center gap-4 ">
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
              <Transaction
                //passing the props down
                totalOps={totalOps}
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
          <div className="w-1/3 bg-gray-800 p-4 rounded-md">
            <p className="text-baby-blue mb-3 ">
              information about {data?.name}
            </p>
            <p className=" my-1.5">
              Number of Transactions: {data?.transaction_num}
            </p>
            <p className=" my-1.5">
              Trasnaction Varibales: {data?.variable_num}
            </p>
            <p className=" my-1.5">
              Trasnaction Random Length: {data?.transaction_len}
            </p>
          </div>
        </div>
      </div>
      <div>
        <GraphComponent graph={graph} />
      </div>
    </div>
  );
};

export default TransactionList;
