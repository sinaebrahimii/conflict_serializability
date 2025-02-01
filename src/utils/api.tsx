export interface OperationResponse {
  id: string;
  order: string;
  method: "r" | "w";
  variable: string;
  transaction: number;
  schedule_id?: string;
}

export interface ScheduleResponse {
  id: string;
  name: string;
  operations: OperationResponse[];
}

// api.ts
const API_BASE_URL = "http://localhost:8000";

export async function getSchedules(): Promise<ScheduleResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
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

    const data: ScheduleResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
}

export const moveOperationToSchedule = async (
  operationId: string,
  scheduleId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/operations/change_schedule/${operationId}?schedule_id=${scheduleId}`,
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
