import { CloseOutlined } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import SelectController from "components/SelectController";
import { useState } from "react";
import { useForm } from "react-hook-form";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: "-4px 10px 30px 0px #0000001A",
  borderRadius: 4,
  overflow: "hidden",
  padding: 2,
  paddingRight: 0,
  width: 576,
};

type TAddBookingProps = {
  isModalAdd: boolean;
  setIsModalAdd: (value: boolean) => void;
  listProjects: { value: string; label: string }[] | [];
  listBudgets: { value: string; label: string }[] | [];
};
function AddBooking({
  setIsModalAdd,
  isModalAdd,
  listProjects = [],
  listBudgets = [],
}: TAddBookingProps) {
  const { control } = useForm();

  const [typeBooking, setTypeBooking] = useState<"PROJECT" | "TIME_OFF">(
    "PROJECT",
  );

  const mockData = [
    {
      name: "project",
      label: "Project",
      required: true,
      options: listProjects,
    },
    { name: "budget", label: "Budget", required: true, options: listBudgets },
    { name: "service", label: "Service", required: true },
    { name: "user", label: "User", required: true },
    { name: "role", label: "Role", required: true },
  ];

  return (
    <Modal
      open={isModalAdd as boolean}
      onClose={() => setIsModalAdd(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        ".MuiModal-backdrop": {
          backgroundColor: "#FFFFFFB2",
        },
      }}
    >
      <Box sx={style}>
        <div
          style={{
            width: "100%",
            overflowY: "scroll",
            maxHeight: "90vh",
            margin: "auto",
            paddingRight: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ECECF3",
              paddingBottom: "20px",
            }}
          >
            <Typography color="#333333" variant="h4">
              Create Booking
            </Typography>
            <IconButton
              onClick={() => {
                setIsModalAdd(false);
              }}
            >
              <CloseOutlined sx={{ fontSize: 14, color: "#666666" }} />
            </IconButton>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}
          >
            <div
              style={{
                width: "240px",
                height: "56px",
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ECECF3",
                borderRadius: "100px",
                cursor: "pointer",
              }}
            >
              <Button
                style={{
                  width: "124px",
                  height: "100%",
                  borderRadius: "100px",
                  background: typeBooking === "PROJECT" ? "#D9F0FD" : "white",
                  color: typeBooking === "PROJECT" ? "#045EB8" : "#333333",
                  textTransform: "unset",
                }}
                onClick={() => {
                  setTypeBooking("PROJECT");
                }}
              >
                Project
              </Button>
              <Button
                style={{
                  width: "124px",
                  height: "100%",
                  borderRadius: "100px",
                  background: typeBooking === "TIME_OFF" ? "#D9F0FD" : "none",
                  color: typeBooking === "TIME_OFF" ? "#045EB8" : "#333333",
                  textTransform: "unset",
                }}
                onClick={() => {
                  setTypeBooking("TIME_OFF");
                }}
              >
                Time off
              </Button>
            </div>
          </div>
          {typeBooking === "PROJECT" && (
            <form
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {mockData.map((item) => (
                <SelectController
                  control={control}
                  name={item.name}
                  label={item.label}
                  required={item?.required}
                  listOptions={item?.options || []}
                  sx={{
                    borderRadius: "100px",
                    background:
                      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#EFEFEF",
                    },
                  }}
                />
              ))}

              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: "bold",
                      width: "50%",
                    }}
                  >
                    Date range <span style={{ color: "red" }}>*</span>
                  </label>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: "bold",
                      width: "50%",
                    }}
                  >
                    Allocation <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #E0E0E0",
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: 100,
                      alignItems: "center",
                      width: "50%",
                    }}
                  >
                    <label style={{ margin: 5, fontWeight: 200 }} htmlFor="">
                      Designer |
                    </label>
                    <input
                      type="date"
                      style={{
                        border: "none",
                        borderRadius: 25,
                        outline: "none",
                        appearance: "none",
                        background: "white",
                        marginRight: 10,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #E0E0E0",
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: 100,
                      alignItems: "center",
                      width: "50%",
                    }}
                  >
                    <label style={{ margin: 5, fontWeight: 200, width: "20%" }}>
                      8h |
                    </label>
                    <select
                      style={{
                        border: "none",
                        borderRadius: 25,
                        outline: "none",
                        appearance: "none",
                        background: "white",
                        width: "80%",
                      }}
                    >
                      <option value=""></option>
                    </select>
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 15,
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        fontSize: 13,
                      }}
                    >
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  Note
                </label>
                <textarea
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    outline: "none",
                    resize: "none",
                    height: 115,
                  }}
                  defaultValue={
                    "They shared that sometimes their app freezes on Android when they're trying to access previously received"
                  }
                />
              </div>
              <div style={{ margin: 20 }}>
                {/* Trạng thái left to schedule */}
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "#FFECEC",
                    color: "#FF4D4D",
                    borderRadius: 25,
                    padding: "5px 10px",
                    fontWeight: "bold",
                  }}
                >
                  -98h left to schedule
                </div>
                {/* Hiển thị chi tiết booking */}
                <div
                  style={{
                    float: "right",
                    fontWeight: "bold",
                    color: "#6c757d",
                    cursor: "pointer",
                  }}
                >
                  Show booking detail{" "}
                  <span
                    style={{
                      transform: "rotate(90deg)",
                      display: "inline-block",
                      fontSize: 13,
                    }}
                  >
                    ▼
                  </span>
                </div>
                <div style={{ clear: "both" }} />
                {/* Chi tiết số giờ */}
                <div style={{ marginTop: 20 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ fontWeight: "bold" }}>Estimate</div>
                    <div style={{ fontWeight: "bold" }}>130h</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>Work</div>
                    <div style={{ fontWeight: "bold", color: "#000" }}>70h</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>Schedule</div>
                    <div style={{ fontWeight: "bold", color: "#000" }}>
                      112h
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>Left to schedule</div>
                    <div style={{ fontWeight: "bold", color: "#FF4D4D" }}>
                      -52h
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", justifyContent: "center", gap: 20 }}
              >
                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 100,
                    cursor: "pointer",
                    backgroundColor: "#E0E0E0",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 100,
                    cursor: "pointer",
                    backgroundColor: "#2AF598",
                    color: "white",
                  }}
                >
                  Create booking
                </button>
              </div>
            </form>
          )}
          {typeBooking === "TIME_OFF" && (
            <form>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                >
                  Select time off category
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    border: "1px solid #E0E0E0",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: 100,
                    alignItems: "center",
                  }}
                >
                  {/* <label style={{ margin: 10, width: "25%", fontWeight: 200 }}>
                    Contry |
                  </label> */}
                  <select
                    style={{
                      width: "90%",
                      padding: "10px 40px 10px 20px",
                      border: "none",
                      borderRadius: 25,
                      outline: "none",
                      appearance: "none",
                      background: "white",
                      height: 40,
                    }}
                  >
                    <option value=""></option>
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 15,
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      fontSize: 13,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  Date range <span style={{ color: "red" }}>*</span>
                </label>
                <DemoContainer
                  components={["SingleInputDateRangeField"]}
                  sx={{ marginBottom: 2 }}
                >
                  <DateRangePicker
                    slots={{ field: SingleInputDateRangeField }}
                    // name="allowedRange"
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarTodayIcon />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "100px", // Bo góc
                          },
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  Allocation <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    border: "1px solid #E0E0E0",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: 100,
                    alignItems: "center",
                  }}
                >
                  <label style={{ margin: 10, width: "25%", fontWeight: 200 }}>
                    1
                  </label>
                  <select
                    style={{
                      width: "90%",
                      padding: "10px 40px 10px 20px",
                      border: "none",
                      borderRadius: 25,
                      outline: "none",
                      appearance: "none",
                      background: "white",
                      height: 40,
                    }}
                  >
                    <option value=""></option>
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 15,
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      fontSize: 13,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                >
                  Note
                </label>
                <textarea
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    outline: "none",
                    resize: "none",
                    height: 115,
                  }}
                  defaultValue={
                    "They shared that sometimes their app freezes on Android when they're trying to access previously received"
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 100,
                    cursor: "pointer",
                    backgroundColor: "#E0E0E0",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 100,
                    cursor: "pointer",
                    backgroundColor: "#2AF598",
                    color: "white",
                  }}
                >
                  Create booking
                </button>
              </div>
            </form>
          )}
        </div>
      </Box>
    </Modal>
  );
}
export default AddBooking;
