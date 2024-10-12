import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { BodyCell, StatusCell } from "components/Table"
import Image from "next/image"
import { formatDate } from "utils/index"

const iconUrl = "/images/beatAudio.png"
function ProjectBadge({
  iconUrl,
  title,
  colAmounts,
}: {
  iconUrl: string
  title: string
  colAmounts: number
}) {
  return (
    <TableRow
      sx={{
        backgroundColor: "#D9F0FD",
      }}
    >
      <TableCell sx={{ border: 0 }}>
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <Image width={32} height={32} src={iconUrl} alt='Project Image' />
          <Typography color='#0575E6' fontSize={14} fontWeight={500}>
            {title}
          </Typography>
        </Stack>
      </TableCell>
      {Array(colAmounts - 1)
        .fill(0)
        .map((_, index) => (
          <TableCell sx={{ border: 0 }} key={index}></TableCell>
        ))}
    </TableRow>
  )
}

function DashboardTableCellHeader({
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

function ActiveProjectsTable() {
  const HEADER_LIST = [
    { value: "name", width: "33%" },
    { value: "Project Manager", width: "33%" },
    { value: "Last activity", width: "33%" },
  ]
  const mockData = [
    {
      id: 1,
      name: "Master Card",
      project_manager: {
        avatar: "/images/mockAvatar.png",
        name: "Gary",
      },
      last_activity: "2023-06-01T16:53:39.685Z",
    },
    {
      id: 2,
      name: "Master Card",
      project_manager: {
        avatar:"/images/mockAvatar.png",
        name: "Albert Flores",
      },
      last_activity: "2023-06-01T16:53:39.685Z",
    },
    {
      id: 3,
      name: "Master Card",
      project_manager: {
        avatar: "/images/mockAvatar.png",
        name: "Gary",
      },
      last_activity: "2023-06-01T16:53:39.685Z",
    },
  ]

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <DashboardTableCellHeader headerList={HEADER_LIST} />
          </TableRow>
          <ProjectBadge
            iconUrl={iconUrl}
            title='Project 1'
            colAmounts={HEADER_LIST.length}
          />
        </TableHead>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.id}>
              <BodyCell>
                <Typography textAlign='left' fontWeight={600} fontSize={14}>
                  {row.name}
                </Typography>
              </BodyCell>
              <BodyCell>
                <Stack direction='row' spacing={1.5}>
                  <Image
                    src={row.project_manager.avatar}
                    alt={row.project_manager.name}
                    width={32}
                    height={32}
                    style={{ borderRadius: "50%" }}
                  />
                  <Typography>{row.project_manager.name}</Typography>
                </Stack>
              </BodyCell>
              <BodyCell sx={{ textAlign: "right" }}>
                {convertTimestamp(row.last_activity)}
              </BodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function MyTaskTable() {
  const HEADER_LIST = [
    { value: "Project task", width: "33%" },
    { value: "Status", width: "33%" },
    { value: "Due date", width: "33%" },
  ]
  const mockData = [
    {
      id: 1,
      projectTask: "Xây dựng chiến lược marketing",
      status: {
        label: "filter.status.active",
        active: true,
      },
      dueDate: "2023-06-01T16:53:39.685Z",
    },
    {
      id: 2,
      projectTask: "Xây dựng chiến lược marketing",
      status: {
        label: "filter.status.active",
        active: true,
      },
      dueDate: "2023-06-01T16:53:39.685Z",
    },
    {
      id: 3,
      projectTask: "Xây dựng chiến lược marketing",
      status: {
        label: "filter.status.active",
        active: true,
      },
      dueDate: "2023-06-01T16:53:39.685Z",
    },
    {
      id: 4,
      projectTask: "Xây dựng chiến lược marketing",
      status: {
        label: "filter.status.close",
        active: false,
      },
      dueDate: "2023-06-01T16:53:39.685Z",
    },
  ]

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <DashboardTableCellHeader headerList={HEADER_LIST} />
          </TableRow>
          <ProjectBadge
            iconUrl={iconUrl}
            title='Project 1'
            colAmounts={HEADER_LIST.length}
          />
        </TableHead>
        <TableBody>
          {mockData.map((row) => {
            return             <TableRow key={row.id}>
            <BodyCell>
              <Typography textAlign='left' fontWeight={600} fontSize={14}>
                {row.projectTask}
              </Typography>
            </BodyCell>
            <StatusCell
              color={row.status.active ? "success" : "error"}
              text={row.status.label}
            />
            <BodyCell sx={{ textAlign: "right" }}>
              {convertTimestamp(row.dueDate)}
            </BodyCell>
          </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function TimeOffTable() {
  const HEADER_LIST = [
    { value: "Project task" },
    { value: "Date" },
    { value: "Duration" },
    { value: "Note" },
  ]
  const mockData = [
    {
      id: 1,
      projectTask: "Louis Vuitton",
      date: "2023-06-01T16:53:39.685Z",
      duration: "3h",
      note: "Web Designer",
    },
    {
      id: 2,
      projectTask: "Louis Vuitton",
      date: "2023-06-01T16:53:39.685Z",
      duration: "3h",
      note: "Web Designer",
    },
    {
      id: 3,
      projectTask: "Louis Vuitton",
      date: "2023-06-01T16:53:39.685Z",
      duration: "3h",
      note: "Web Designer",
    },
    {
      id: 4,
      projectTask: "Louis Vuitton",
      date: "2023-06-01T16:53:39.685Z",
      duration: "3h",
      note: "Web Designer",
    },
    {
      id: 5,
      projectTask: "Louis Vuitton",
      date: "2023-06-01T16:53:39.685Z",
      duration: "3h",
      note: "Web Designer",
    },
  ]

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <DashboardTableCellHeader headerList={HEADER_LIST} />
          </TableRow>
          <ProjectBadge
            iconUrl={iconUrl}
            title='Project 1'
            colAmounts={HEADER_LIST.length}
          />
        </TableHead>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.id}>
              <BodyCell>
                <Typography textAlign='left' fontWeight={600} fontSize={14}>
                  {row.projectTask}
                </Typography>
              </BodyCell>
              <BodyCell>
                <Typography fontSize={14}>{formatDate(row.date)}</Typography>
              </BodyCell>
              <BodyCell>
                <Typography fontSize={14}>{row.duration}</Typography>
              </BodyCell>
              <BodyCell sx={{ textAlign: "right" }}>{row.note}</BodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export { ActiveProjectsTable, MyTaskTable, TimeOffTable }

function convertTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const day = date.getUTCDate().toString().padStart(2, "0")
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
  const year = date.getUTCFullYear()
  const hours = date.getUTCHours().toString().padStart(2, "0")
  const minutes = date.getUTCMinutes().toString().padStart(2, "0")

  return `${day}-${month}-${year} ${hours}:${minutes}`
}
