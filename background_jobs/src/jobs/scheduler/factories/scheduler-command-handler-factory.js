import { DailyScheduler } from "../command-handler/scheduler.js";

export const DailyScheduleFactory = () => {
  return new DailyScheduler();
};
