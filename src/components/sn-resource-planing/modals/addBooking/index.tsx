import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InputAdornment from "@mui/material/InputAdornment";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useState } from "react";

function AddBooking({ setIsModalAdd }: any) {
  const [isProject, setIsProject] = useState<Boolean>(true);
  const [isTimeline, setIsTimeline] = useState<Boolean>(false);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "576px",
          height: "1166px",
          background: "white",
          zIndex: 100,
          transform: "translateX(-50%)",
          padding: "10px",
        }}
      >
        <div
          style={{
            width: "100%",
            margin: "auto",
            border: "1px solid #E0E0E0",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            overflowY: "scroll",
            maxHeight: "800px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ margin: "0" }}>Create Booking</h2>
            <button
              style={{
                marginRight: "20px",
                height: "100%",
                marginTop: "10px",
                background: "white",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsModalAdd((prev) => !prev);
              }}
            >
              X
            </button>
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
              <button
                style={{
                  width: "124px",
                  height: "100%",
                  borderRadius: "100px",
                  border: "none",
                  background: isProject ? "#D9F0FD" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsProject((prev) => true);
                  setIsTimeline((prev) => false);
                }}
              >
                Project
              </button>
              <button
                style={{
                  width: "124px",
                  height: "100%",
                  borderRadius: "100px",
                  border: "none",
                  background: isTimeline ? "#D9F0FD" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsProject((prev) => false);
                  setIsTimeline((prev) => true);
                }}
              >
                Time off
              </button>
            </div>
          </div>
          {isProject && (
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
          {isTimeline && (
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
      </div>
    </>
  );
}
export default AddBooking;
