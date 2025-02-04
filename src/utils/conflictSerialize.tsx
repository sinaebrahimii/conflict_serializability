import { OperationResponse } from "./api";

const doOperationsConflict = (
  op1: OperationResponse,
  op2: OperationResponse
): boolean => {
  return (
    //checks the transaction number,variable,method
    op1.variable === op2.variable &&
    op1.transaction !== op2.transaction &&
    //make sure at least one operation is write
    (op1.method === "w" || op2.method === "w")
  );
};

// Detect conflict serializability
export const isConflictSerializable = (
  operations: OperationResponse[]
): boolean => {
  //create graph structure
  const graph = new Map<number, Set<number>>();

  // Build precedence graph
  for (let i = 0; i < operations.length; i++) {
    const op1 = operations[i];
    for (let j = i + 1; j < operations.length; j++) {
      const op2 = operations[j];
      if (doOperationsConflict(op1, op2)) {
        //extract transaction numbers
        const t1 = op1.transaction;
        const t2 = op2.transaction;
        //if there is no t1 in the graph add t1 with empty set
        if (!graph.has(t1)) graph.set(t1, new Set());
        graph.get(t1)?.add(t2);
      }
    }
  }

  // Check for cycles using DFS
  const visited = new Map<number, boolean>();
  const recursionStack = new Map<number, boolean>();
  let hasCycle = false;

  const checkCycle = (node: number) => {
    if (recursionStack.get(node)) {
      hasCycle = true;
      return;
    }
    if (visited.get(node)) return;

    visited.set(node, true);
    recursionStack.set(node, true);

    const neighbors = graph.get(node) || new Set();
    neighbors.forEach((neighbor) => checkCycle(neighbor));

    recursionStack.set(node, false);
  };

  graph.forEach((_, node) => {
    if (!visited.get(node)) checkCycle(node);
  });

  return !hasCycle;
};
