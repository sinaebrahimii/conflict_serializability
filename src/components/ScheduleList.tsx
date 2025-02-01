import { getSchedules } from "../utils/api";
import Schedule from "./Schedule";
import { useQuery } from "@tanstack/react-query";

const ScheduleList = () => {
  const { data } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  return (
    <div className="w-full flex justify-center items-center gap-4">
      {data?.map((schedule, index) => {
        // Determine the next and previous schedules
        const nextItem = index < data.length - 1 ? data[index + 1] : null;
        const prevItem = index > 0 ? data[index - 1] : null;

        return (
          <Schedule
            scheduleName={schedule.name}
            key={schedule.id}
            ops={schedule.operations}
            scheduleId={schedule.id}
            last={data[data.length - 1].id}
            first={data[0].id}
            next={nextItem?.id} // Pass nextItem as a prop
            prev={prevItem?.id} // Pass prevItem as a prop
          />
        );
      })}
    </div>
  );
};

export default ScheduleList;
