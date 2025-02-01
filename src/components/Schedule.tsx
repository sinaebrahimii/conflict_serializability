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
import { isConflictSerializable } from "../utils/conflictSerialize";
import { OperationResponse } from "../utils/api";
import SortableOperation from "./SortableOperation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveOperationToSchedule } from "../utils/api";

// Main Component
const Schedule = ({
  ops,
  scheduleName,
  scheduleId,
  last,
  first,
  next,
  prev,
}: {
  ops: OperationResponse[];
  scheduleName: string;
  scheduleId: string;
  last?: string;
  first?: string;
  next?: string;
  prev?: string;
}) => {
  const [operations, setOperations] = useState<OperationResponse[] | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const isCfsz = operations && isConflictSerializable(operations);
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
    setActiveSchedule(scheduleId);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOperations((items) => {
        const currentItems = items || [];
        // If the operation is dropped within the same schedule
        if (activeSchedule === scheduleId) {
          const oldIndex = currentItems.findIndex(
            (item) => item.id === active.id
          );
          const newIndex = currentItems.findIndex(
            (item) => item.id === over.id
          );

          if (oldIndex === -1 || newIndex === -1) {
            return currentItems;
          }
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
      <div className="flex flex-col justify-center items-center bg-gray-700 p-4 rounded-2xl w-[250px] h-[650px]">
        <p className="text-white text-xl font-bold my-1">{scheduleName}</p>
        <p
          className={`${isCfsz ? "text-green-500" : "text-red-500"} mt-1 mb-2`}
        >
          {isCfsz ? "This is conflict serializable" : "graph has cycle"}
        </p>

        {operations && (
          <SortableContext
            items={operations}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 w-full flex flex-col items-center h-[550px] justify-center">
              {operations.map((operation) => {
                return (
                  <div
                    className="flex items-baseline gap-1 w-full justify-center"
                    key={operation.id}
                  >
                    <span
                      className={`cursor-pointer ${
                        first === scheduleId && "text-gray-600"
                      }`}
                      onClick={() =>
                        prev &&
                        first !== scheduleId &&
                        handleClick(operation.id, prev)
                      }
                    >
                      {"<"}
                    </span>
                    <SortableOperation operation={operation} />
                    <span
                      className={`cursor-pointer ${
                        last === scheduleId && "text-gray-600"
                      }`}
                      onClick={() =>
                        next &&
                        last !== scheduleId &&
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
            <div className="text-center bg-blue-800 text-white rounded-2xl p-2 opacity-80">
              {`${activeItem.method}${activeItem.transaction}(${activeItem.variable})`}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Schedule;
