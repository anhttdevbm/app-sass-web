import React, { PureComponent } from 'react';
import { Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';

const LineChartTicket = () => {

    const data = [
        {
            name: 'Jan',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Feb',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Mar',
            uv: 6000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Apr',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'May',
            uv: 1890,
            pv: 4800,
            amt: 5000,
        },
        {
            name: 'Jun',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Jul',
            uv: 3490,
            pv: 3000,
            amt: 2100,
        },
        {
            name: 'Sep',
            uv: 3490,
            pv: 4300,
            amt: 900,
        },
        {
            name: 'Oct',
            uv: 3490,
            pv: 300,
            amt: 2100,
        },
        {
            name: 'Nov',
            uv: 3490,
            pv: 2500,
            amt: 2100,
        },
        {
            name: 'Deb',
            uv: 3490,
            pv: 1200,
            amt: 2100,
        },
    ];

    return (
        <Stack mt={2} p={{ xs: 0, sm: 2, md: 3 }} border="1px solid #EFEFEF" borderRadius="12px">
            <Stack direction="row" pb={2} pl={2}>
                <Text fontSize={20} fontWeight="700" color="#1A1A1A">Tickets  by status</Text>

            </Stack>
            <Stack margin="auto" width="100%" height="230px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 50,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis axisLine={false} tickLine={false} dataKey="name" interval={0}   tick={{ fontSize: 10 }}/>
                        <YAxis axisLine={false} tickLine={false} tickMargin={30} fontSize={12} />
                        <Tooltip />
                        <Legend/>
                        {/* <ReferenceLine x="Mar" stroke="#000" label="Max PV PAGE" /> */}
                        <Line type="monotone" dataKey="pv" strokeWidth={2} dot={false} stroke="#3CD856" />
                        <Line type="monotone" dataKey="uv" strokeWidth={2} dot={false} stroke="#A700FF" />
                        <Line type="monotone" dataKey="amt" strokeWidth={2} dot={false} stroke="#EF4444" />

                    </LineChart>
                </ResponsiveContainer>
            </Stack>

        </Stack>
    )
}

export default memo(LineChartTicket)