import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "clean up deleted projects",
  {
    hourUTC: 3,
    minuteUTC: 0,
  },
  internal.cleanup.removeDeletedProjects,
);

export default crons;
