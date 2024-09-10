import { Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import { memo } from "react"
import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ColumnChart = () => {

    const data = [
        { name: 'Sun', value: 400, },
        { name: 'Mon', value: 500, },
        { name: 'Tue', value: 900, },
        { name: 'Wed', value: 700, },
        { name: 'Thu', value: 123, },
        { name: 'Fri', value: 300, },
        { name: 'Sat', value: 560, },

    ];

    const renderCustomAxisTick = ({ x, y, payload, width }) => {
        let day = '';
        switch (payload.value) {
            case 'Sun':
                day = "Sun"
                break;
            case 'Mon':
                day = "Mon"
                break;
            case 'Tue':
                day = "Tue"
                break;
            case 'Wed':
                day = "Wed"
                break;
            case 'Thu':
                day = "Thu"
                break;
            case 'Fri':
                day = "Fri"
                break;
            case 'Sat':
                day = "Sat"
                break;
            default:
        }
        return <text
            style={{ fontSize: 12 }}
            x={x}
            y={y + 20}
            fill="#666"
            textAnchor="middle"
            dy={0}
        >
            {day}
        </text>
    }

    const CustomBar = (props) => {
        const { x, y, width, height, fill, radius } = props;
        const radiusTopLeft = radius;
        const radiusTopRight = radius;
        const radiusBottomLeft = 0;
        const radiusBottomRight = 0;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    rx={radiusTopLeft}
                    ry={radiusTopRight}
                />
            </g>
        );
    };
    return (
        <Stack p={{xs:0 , sm: 2 ,md :3}} border="1px solid #EFEFEF" borderRadius="12px">
            <Stack direction="row" pb={2} pl={2}>
                <Text fontSize={20} fontWeight="700" color="#1A1A1A">Average ticket  by week</Text>

            </Stack>
            <Stack margin="auto" width="100%" height="230px">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid vertical={false} strokeWidth={0.3} />
                <XAxis axisLine={false} tickLine={false} dataKey="name" tick={renderCustomAxisTick} />
                <YAxis tickMargin={12} fontSize={12} axisLine={false} tickLine={false} />
                <Bar shape={<CustomBar radius={8} />} dataKey="value" barSize={30} fill="#14B9E5" />
            </BarChart>
            </ResponsiveContainer>
            </Stack>

        </Stack>
    )
}

export default memo(ColumnChart)