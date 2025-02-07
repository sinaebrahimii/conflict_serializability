import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Operation } from "../utils/api";
import SortableOperation from "./SortableOperation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveOperationToSchedule, changeOrder } from "../utils/api";
import DialogForm from "./DialogForm";
import OperationForm from "./OperationForm";
// Main Component
const Transaction = ({
  ops,
  totalOps,
  scheduleName,
  transactionId,
  last,
  first,
  next,
  prev,
}: {
  ops: Operation[];
  totalOps: number;
  scheduleName: string;
  transactionId: string;
  last?: string;
  first?: string;
  next?: string;
  prev?: string;
}) => {
  const [operations, setOperations] = useState<Operation[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Sync local state with ops prop
  useEffect(() => {
    setOperations(ops);
  }, [ops]);

  // Mutation to move an operation to another schedule
  const { mutate } = useMutation({
    mutationFn: ({
      operationId,
      scheduleId,
    }: {
      operationId: string;
      scheduleId: string;
    }) => moveOperationToSchedule(operationId, scheduleId),
    onSuccess: (data) => {
      console.log("Operation moved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      console.error("Error moving operation:", error);
    },
  });
  console.log("totalOPS:", totalOps);
  const { mutate: oerderMutate } = useMutation({
    mutationFn: ({
      newOrder,
      newOrder2,
      opId,
      op2Id,
    }: {
      newOrder: string;
      newOrder2: string;
      opId: string;
      op2Id: string;
    }) => changeOrder(newOrder, newOrder2, opId, op2Id),
    onSuccess: (data) => {
      console.log("Operation reordered successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      // setOperations(data.operations);
    },
    onError: (error) => {
      console.error("Error reordering operation:", error);
    },
  });
  // Sensors for pointer and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveSchedule(transactionId);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOperations((items) => {
        const currentItems = items || [];
        // If the operation is dropped within the same schedule
        if (activeSchedule === transactionId) {
          const oldIndex = currentItems.findIndex(
            (item) => item.id === active.id
          );
          const newIndex = currentItems.findIndex(
            (item) => item.id === over.id
          );

          if (oldIndex === -1 || newIndex === -1) {
            return currentItems;
          }
          oerderMutate({
            newOrder: ops[newIndex].order, // Pass the new index as the order
            newOrder2: ops[oldIndex].order, // Pass the new index as the order
            opId: active.id as string, // Pass the ID of the dragged item
            op2Id: over.id as string, // Pass the ID of the dragged item
          });
          return arrayMove(currentItems, oldIndex, newIndex);
        }

        return currentItems;
      });
    }

    setActiveId(null);
    setActiveSchedule(null);
  };

  const handleClick = (id: string, whereTo: string) => {
    mutate({ operationId: id, scheduleId: whereTo });
  };

  // Get the active item for the overlay
  const activeItem = operations?.find((op) => op.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col    justify-center items-center bg-gray-800 p-3 rounded-2xl w-[250px] h-full">
        <p className="text-white text-xl font-bold my-1 ">{scheduleName}</p>
        <DialogForm
          form_number={2}
          total_ops={totalOps}
          t_id={transactionId}
          buttonText="Add more"
          buttonClassName=" text-baby-blue  hover:scale-105 hover:bg-gray-600 bg-gray-700 flex justify-center items-center gap-2"
        >
          <OperationForm
            transaction_id={transactionId}
            total_operations={totalOps}
          />
        </DialogForm>

        {operations && (
          <SortableContext
            items={operations}
            strategy={verticalListSortingStrategy}
          >
            <div
              className={`mt-4 h-full grid  grid-flow-row   w-full `}
              style={{
                gridTemplateRows: `repeat(${totalOps},minmax(0, 1fr))`,
              }}
            >
              {operations.map((operation) => {
                return (
                  <div
                    className={`flex my-1 items-baseline gap-1 w-full justify-center row-span-1 border border-t-0 border-r-0 border-l-0  border-b-gray-600   col-span-1`}
                    key={operation.id}
                    style={{ gridRowStart: operation.order }}
                  >
                    <span
                      className={`cursor-pointer ${
                        first === transactionId && "text-gray-600"
                      }`}
                      onClick={() =>
                        prev &&
                        first !== transactionId &&
                        handleClick(operation.id, prev)
                      }
                    >
                      {"<"}
                    </span>
                    <SortableOperation operation={operation} />
                    <span
                      className={`cursor-pointer ${
                        last === transactionId && "text-gray-600"
                      }`}
                      onClick={() =>
                        next &&
                        last !== transactionId &&
                        handleClick(operation.id, next)
                      }
                    >
                      {">"}
                    </span>
                  </div>
                );
              })}
            </div>
          </SortableContext>
        )}
        {/* Drag Overlay (Preview during drag) */}
        <DragOverlay>
          {activeItem ? (
            <div className="text-center bg-baby-blue text-gray-950 rounded-2xl p-2 opacity-80">
              {`${activeItem.method}(${activeItem.variable})`}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Transaction;
