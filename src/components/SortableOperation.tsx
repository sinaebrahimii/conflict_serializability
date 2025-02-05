import { Operation } from "../utils/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableOperation = ({ operation }: { operation: Operation }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: operation.id }); // Use operation.id instead of operation.order

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // Mutation to move an operation to another schedule

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-center w-14 bg-blue-700 text-white rounded-2xl p-2 mb-2 cursor-grab active:cursor-grabbing"
    >
      {`${operation.method}(${operation.variable})${operation.order}`}
    </div>
  );
};
export default SortableOperation;
