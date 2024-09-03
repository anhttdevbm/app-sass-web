import { TableCell, TableHead, TableRow } from "@mui/material";
import RateIcon from "icons/RateIcon";

function TopTable() {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            background: "#F7F7FD",
            padding: 0,
            border: "1px solid #F7F7FD",
            width: "20px",
          }}
        ></TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
          }}
        >
          ITEM DETAILS
        </TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
          }}
          align="right"
        >
          UNIT
        </TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
          }}
          align="right"
        >
          QUANTITY
        </TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
            position: "relative",
            paddingRight: "40px",
          }}
          align="right"
        >
          RATE{" "}
          <RateIcon
            sx={{
              height: "18px",
              width: "18px",
              position: "absolute",
              top: "18px",
              right: "16px",
            }}
          />
        </TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
          }}
          align="right"
        >
          DISCOUNT
        </TableCell>
        <TableCell
          sx={{
            color: "#222222",
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid #EBEAF2",
          }}
          align="right"
        >
          AMOUNT
        </TableCell>
        <TableCell
          sx={{
            background: "#F7F7FD",
            padding: 0,
            border: "1px solid #F7F7FD",
            width: "50px",
          }}
        ></TableCell>
      </TableRow>
    </TableHead>
  );
}

export default TopTable;
