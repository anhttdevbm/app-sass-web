import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import OpenTicketDetailIcon from "icons/OpenTicketDetailIcon";
import { memo } from "react"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Label, LabelList } from 'recharts';

interface ViewBox {
    cx: number;
    cy: number;
    width: number;
    height: number;
}

let fakeTotalTicket = 212

const PieTicket = () => {
    const data = [
        { name: 'New', value: 50 },
        { name: 'Open', value: 25 },
        { name: 'In-progress', value: 20 },
        { name: 'On-hold', value: 25 },
        { name: 'Resolved', value: 78 },
        { name: 'closed', value: 12 },
    ];
    const COLORS = ['#14B8A6', '#3B82F6', '#6366F1', '#EC4899', "#F59E0B", "#FACC15"];

    const calculatePercent = (value: number, count: number) => {
        return ((value / count) * 100).toFixed(2)
    }
    return (
        <Stack mt={2} p={{ xs: 0, sm: 2, md: 3 }} border="1px solid #EFEFEF" borderRadius="12px">
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={2} pl={2}>
                <Text fontSize={20} fontWeight="700" color="#1A1A1A">Tickets  by status</Text>
                <Box
                    // onClick={() => handleOpenTicketDetail(data?.id)}
                    display="flex"
                    alignContent="center"
                    justifyContent="flex-end"
                    gap="10px"  
                >
                    <Text
                        sx={{
                            color: "#0575E6",
                            fontSize: 13,
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight : 700
                        }}
                    >
                        {" "}
                        View Details
                    </Text>
                    <OpenTicketDetailIcon />
                </Box>

            </Stack>
            <Stack direction={{ xs: "column", sm: "row", md: "row" }} width="100%" height="fit-content">
                <Box width={{ xs: "100%", sm: "50%", md: "50%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart >
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={1}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="center"
                                    content={({ viewBox, value }) => {
                                        const { cx, cy } = viewBox as ViewBox;
                                        return (
                                            <g>
                                                <text x={cx} y={cy - 20} textAnchor="middle" dominantBaseline="central" fill="#ccc" fontSize={12}>
                                                    {"Total Ticket"}
                                                </text>
                                                <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fill="#000" fontSize={20}>
                                                    {fakeTotalTicket}
                                                </text>
                                            </g>
                                        );
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>


                <Box width={{ xs: "100%", sm: "50%", md: "50%" }}>
                    <Box pb={2} display="flex" borderBottom="1px solid #737373" gap={2}>
                        <Box width={"70%"} display="flex" gap="12px" alignItems="center">
                            <Box width={12} height={12} borderRadius={50} mt={0.5} sx={{ backgroundColor: "#fff" }}></Box>
                            <Text fontSize={14} fontWeight={700} color="#737373">Status</Text>
                        </Box>
                        <Text width={"25%"} fontSize={14} fontWeight={700} color="#737373">Number</Text>
                        <Text width={"25%"} fontSize={14} fontWeight={700} color="#737373">%</Text>
                    </Box>
                    {data?.map((item, index) => (
                        <Box pt={1} pb={1} display="flex" gap={2} alignItems="center">
                            <Box width={"70%"} display="flex" gap="12px" alignItems="center">
                                <Box width={12} height={12} borderRadius={50} mt={0.5} sx={{ backgroundColor: COLORS[index] }}></Box>
                                <Text fontSize={12} fontWeight={700} color="#737373">{item?.name}</Text>
                            </Box>
                            <Text width={"25%"} fontSize={12} fontWeight={700} color="#737373">{item?.value}</Text>
                            <Text width={"25%"} fontSize={12} fontWeight={700} color="#737373">{calculatePercent(item?.value, fakeTotalTicket)}%</Text>
                        </Box>
                    ))}

                </Box>
            </Stack>

        </Stack>
    )
}

export default memo(PieTicket)