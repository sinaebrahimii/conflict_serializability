import { create } from "zustand";

interface Operation {
  id: string;
  order: string;
  method: "r" | "w";
  variable: string;
  transaction: number;
  scheduleId: string;
}

interface Schedule {
  id: string;
  name: string;
  operations: Operation[];
}

interface ScheduleStore {
  schedules: Schedule[];
  addSchedule: (name: string) => void;
  updateScheduleName: (id: string, newName: string) => void;
  addOperationToSchedule: (
    scheduleId: string,
    operation: Omit<Operation, "id" | "scheduleId">
  ) => void;
  updateOperation: (operationId: string, updates: Partial<Operation>) => void;
}

// Initialize with your sample data

const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [
    {
      id: "1",
      name: "Initial Schedule",
      operations: [
        {
          order: "1",
          method: "r",
          variable: "A",
          transaction: 1,
          id: "1",
          scheduleId: "1",
        },
        {
          order: "2",
          method: "w",
          variable: "B",
          transaction: 2,
          id: "2",
          scheduleId: "1",
        },
        {
          order: "3",
          method: "r",
          variable: "B",
          transaction: 1,
          id: "3",
          scheduleId: "1",
        },
        {
          order: "4",
          method: "w",
          variable: "A",
          transaction: 2,
          id: "4",
          scheduleId: "1",
        },
        {
          order: "5",
          method: "w",
          variable: "B",
          transaction: 1,
          id: "5",
          scheduleId: "1",
        },
      ],
    },
  ],

  addSchedule: (name) =>
    set((state) => ({
      schedules: [
        ...state.schedules,
        {
          id: "2",
          name,
          operations: [],
        },
      ],
    })),

  updateScheduleName: (id, newName) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, name: newName } : schedule
      ),
    })),

  addOperationToSchedule: (scheduleId, operation) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              operations: [
                ...schedule.operations,
                {
                  ...operation,
                  id: "1",
                  scheduleId,
                },
              ],
            }
          : schedule
      ),
    })),

  updateOperation: (operationId, updates) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) => ({
        ...schedule,
        operations: schedule.operations.map((op) =>
          op.id === operationId ? { ...op, ...updates } : op
        ),
      })),
    })),
}));

export default useScheduleStore;
