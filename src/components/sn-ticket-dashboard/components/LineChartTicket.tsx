import { Stack } from "@mui/material";
import { Text } from "components/shared";
import useGetDashboardData from 'queries/ticket-agent/useDashboard/useDashboard';
import { memo } from "react";
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';


interface MonthData {
    replyFirstTime: number | null;
    resolutionFirstTime: number | null;
}


interface TransformedData {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}
const LineChartTicket = () => {


    const {lineChartTicketData} = useGetDashboardData();

    const lstMonthArray = lineChartTicketData?.data?.data?.data?.agentPerformance?.map((item: { lstMonth: MonthData }) => item.lstMonth)

    const transformedData : TransformedData[]  = lstMonthArray?.flatMap((item : MonthData) => {
        return Object.entries(item).map(([month, monthData]) => {
            const monthDataTyped = monthData as MonthData;
            return {
                name: month,
                FirstReplyTime: monthDataTyped.replyFirstTime || 0, 
                FirstResolutionTime: monthDataTyped.resolutionFirstTime || 0, 
            };
        });
    });

    const formatTick = (value: number) => {
        const absValue = Math.abs(value); 
        let suffix = '';
        let formattedValue = value;
    
        if (absValue >= 1e9) { 
            formattedValue = Number((value / 1e9).toFixed(1));
            suffix = 'B'; 
        } else if (absValue >= 1e6) { 
            formattedValue = Number((value / 1e6).toFixed(1)); 
            suffix = 'M'; 
        } else if (absValue >= 1e3) { 
            formattedValue = Number((value / 1e3).toFixed(1)); 
            suffix = 'K';
        } else {
            formattedValue = Number(value.toFixed(1)); 
        }
        return `${formattedValue}${suffix}`;
    };
  
    return (
        <Stack mt={2} p={{ xs: 0, sm: 2, md: 3 }} border="1px solid #EFEFEF" borderRadius="12px">
            <Stack direction="row" pb={2} pl={2}>
                <Text fontSize={20} fontWeight="700" color="#1A1A1A">Agent performance</Text>

            </Stack>
            <Stack margin="auto" width="100%" height="230px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={transformedData}
                        margin={{
                            top: 20,
                            right: 50,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis axisLine={false} tickLine={false} dataKey="name" interval={0}   tick={{ fontSize: 10 }}/>
                        <YAxis axisLine={false}     tickFormatter={formatTick}  tickLine={false} tickMargin={30} fontSize={10} />
                        <Tooltip />
                        <Legend/>
                        {/* <ReferenceLine x="Mar" stroke="#000" label="Max PV PAGE" /> */}
                        <Line type="monotone" dataKey="FirstReplyTime" strokeWidth={2} dot={false} stroke="#EF4444" />
                        <Line type="monotone" dataKey="FirstResolutionTime" strokeWidth={2} dot={false} stroke="#A700FF" />
                        {/* <Line type="monotone" dataKey="amt" strokeWidth={2} dot={false} stroke="#3CD856" /> */}

                    </LineChart>
                </ResponsiveContainer>
            </Stack>

        </Stack>
    )
}

export default memo(LineChartTicket)