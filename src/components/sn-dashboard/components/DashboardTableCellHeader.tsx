import { TableCell, Typography } from "@mui/material"

export function DashboardTableCellHeader({
    headerList,
}: {
    headerList: { value: string }[]
}) {
    return headerList.map((header, index) => {
        const isStart = index === 0
        const isEnd = index === headerList.length - 1
        return (
            <TableCell
                key={header.value}
                sx={{
                    border: 0,
                    backgroundColor: "#FAFAFA",
                    borderTopLeftRadius: isStart ? 12 : 0,
                    borderTopRightRadius: isEnd ? 12 : 0,
                }}
            >
                <Typography
                    fontWeight={600}
                    fontSize={14}
                    color='#4D4D4D'
                    textAlign={
                        index > 0
                            ? index === headerList.length - 1
                                ? "right"
                                : "center"
                            : "left"
                    }
                >
                    {header.value}
                </Typography>
            </TableCell>
        )
    })
}