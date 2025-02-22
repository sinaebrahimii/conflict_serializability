import { Transaction, Operation } from "./api";

const doOperationsConflict = (op1: Operation, op2: Operation): boolean => {
  return (
    op1.variable === op2.variable &&
    op1.transaction_id !== op2.transaction_id &&
    (op1.method === "w" || op2.method === "w")
  );
};

// Function to construct precedence graph
export const constructPrecedenceGraph = (
  operations: Operation[],
  transactions: Transaction[]
) => {
  const graph = new Map<string, Set<string>>();

  // Build precedence graph
  for (let i = 0; i < operations.length; i++) {
    const op1 = operations[i];
    for (let j = i + 1; j < operations.length; j++) {
      const op2 = operations[j];
      if (doOperationsConflict(op1, op2)) {
        const t1 = op1.transaction_id.toString();
        const t2 = op2.transaction_id.toString();
        if (!graph.has(t1)) graph.set(t1, new Set());
        graph.get(t1)?.add(t2);
      }
    }
  }

  // Convert to visualization format
  const nodes = Array.from(graph.keys()).map((id) => {
    const transaction = transactions.find((t) => t.id.toString() === id);
    return {
      id,
      label: transaction ? transaction.name : `T${id}`, // Use name if available, fallback to ID
    };
  });

  const edges: { from: string; to: string }[] = [];
  graph.forEach((neighbors, node) => {
    neighbors.forEach((neighbor) => {
      edges.push({ from: node, to: neighbor });
    });
  });

  return { nodes, edges };
};

// Function to check conflict serializability and return the graph
export const checkTransactionsConflictSerializability = (
  transactions: Transaction[]
): {
  serializable: boolean;
  graph: {
    nodes: { id: string; label: string }[];
    edges: { from: string; to: string }[];
  };
} => {
  const allOperations: Operation[] = transactions.flatMap((t) => t.operations);
  allOperations.sort((a, b) => parseInt(a.order) - parseInt(b.order));

  // Construct precedence graph
  const precedenceGraph = constructPrecedenceGraph(allOperations, transactions);

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

    const neighbors = new Set(
      precedenceGraph.edges.filter((e) => e.from === node).map((e) => e.to)
    );
    neighbors.forEach((neighbor) => checkCycle(neighbor));

    recursionStack.set(node, false);
  };

  precedenceGraph.nodes.forEach(({ id }) => {
    if (!visited.get(id)) checkCycle(id);
  });

  return { serializable: !hasCycle, graph: precedenceGraph };
};
