import moment from "moment";

export const formatHoursToHHMM = (hours: number): string => {
  const duration = moment.duration(hours, "hours");
  const formatted = moment.utc(duration.asMilliseconds()).format("HH:mm");
  return formatted;
};
