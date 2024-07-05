import dayjs from "dayjs";
import React, { useState } from "react";

const useDate = () => {
  const [dateRange, setDateRange] = React.useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(dayjs().toString());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(),
  );
};

export default useDate;
