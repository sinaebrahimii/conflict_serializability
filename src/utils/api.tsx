export interface Schedule {
  id: string;
  name: string;
  transactions: Transaction[]; // One-to-many relationship with Transaction
}

export interface Transaction {
  id: string;
  number: string;
  name: string;
  schedule_id: number; // Foreign key to Schedule
  operations: Operation[]; // One-to-many relationship with Operation
}

export interface Operation {
  id: string;
  order: string; // Stored as string to preserve leading zeros
  method: "r" | "w"; // 'r' or 'w'
  variable: string; // Single character variable name
  transaction_id: number; // Foreign key to Transaction
}

// api.ts
const API_BASE_URL = "http://127.0.0.1:8000";

export async function getSchedules(): Promise<Schedule> {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("fetching schedules!");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Schedule = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
}

export const moveOperationToSchedule = async (
  operationId: string,
  transactionId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/operations/change_schedule/${operationId}?transaction_id=${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to move operation");
    }

    const data = await response.json();
    console.log("Operation moved successfully:", data);
    return data; // Return the updated operation if needed
  } catch (error) {
    console.error("Error moving operation:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const changeOrder = async (
  newOrder: string,
  newOrder2: string,
  opId: string,
  op2Id: string
): Promise<Transaction> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/operations/change_order/${opId}?operation_order=${newOrder}&operation_order2=${newOrder2}&op2_id=${op2Id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to move operation");
    }

    const data: Transaction = await response.json();
    console.log("Operation reordered successfully:", data);
    return data; // Return the updated operation if needed
  } catch (error) {
    console.error("Error reordering operation:", error);
    throw error; // Re-throw the error for handling in the component
  }
};
