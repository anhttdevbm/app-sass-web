import { CloseOutlined } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useState } from "react";

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
  isModalAdd: Boolean;
  setIsModalAdd: (value: Boolean) => void;
};

function AddBooking({ setIsModalAdd, isModalAdd }: TAddBookingProps) {
  const [typeBooking, setTypeBooking] = useState<"PROJECT" | "TIME_OFF">(
    "PROJECT",
  );

  return (
    <Modal
      open={true}
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
            maxHeight: "800px",
            margin: "auto",
            paddingRight: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
          <hr style={{ background: "#E0E0E0" }} />
          <div style={{ display: "flex", justifyContent: "center" }}>
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
            <form>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  Project <span style={{ color: "red" }}>*</span>
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
                    Contry |
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
                  }}
                >
                  Budget <span style={{ color: "red" }}>*</span>
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
                  <label style={{ margin: 10, width: "15%", fontWeight: 200 }}>
                    Month 1 |
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
                  }}
                >
                  Service <span style={{ color: "red" }}>*</span>
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
                    Design web |
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
                  }}
                >
                  User <span style={{ color: "red" }}>*</span>
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
                    Thu nguyen |
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
                  }}
                >
                  Role <span style={{ color: "red" }}>*</span>
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
                    Designer |
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

              <div style={{ marginBottom: 20 }}>
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
