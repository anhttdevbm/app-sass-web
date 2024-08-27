export const formatHoursToHHMM = (totalHours: number): string => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};
