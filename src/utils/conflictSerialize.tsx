import { Transaction, Operation } from "./api";

const doOperationsConflict = (op1: Operation, op2: Operation): boolean => {
  return (
    // Checks if the operations are on the same variable
    op1.variable === op2.variable &&
    // Checks if the operations belong to different transactions
    op1.transaction_id !== op2.transaction_id &&
    // Ensures at least one operation is a write
    (op1.method === "w" || op2.method === "w")
  );
};

// Detect conflict serializability
export const isConflictSerializable = (operations: Operation[]): boolean => {
  // Create graph structure
  const graph = new Map<string, Set<string>>();

  // Build precedence graph
  for (let i = 0; i < operations.length; i++) {
    const op1 = operations[i];
    for (let j = i + 1; j < operations.length; j++) {
      const op2 = operations[j];
      if (doOperationsConflict(op1, op2)) {
        // Extract transaction IDs
        const t1 = op1.transaction_id.toString();
        const t2 = op2.transaction_id.toString();
        // If there is no t1 in the graph, add t1 with an empty set
        if (!graph.has(t1)) graph.set(t1, new Set());
        graph.get(t1)?.add(t2);
      }
    }
  }

  // Check for cycles using DFS
  const visited = new Map<string, boolean>();
  const recursionStack = new Map<string, boolean>();
  let hasCycle = false;

  const checkCycle = (node: string) => {
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

// Function to check conflict serializability for a list of transactions
export const checkTransactionsConflictSerializability = (
  transactions: Transaction[]
): boolean => {
  // Combine all operations from all transactions into a single array
  const allOperations: Operation[] = transactions.flatMap(
    (transaction) => transaction.operations
  );
  allOperations.sort((a, b) => parseInt(a.order) - parseInt(b.order));
  console.log(allOperations, "in check");

  // Check if the combined operations are conflict serializable
  return isConflictSerializable(allOperations);
};
