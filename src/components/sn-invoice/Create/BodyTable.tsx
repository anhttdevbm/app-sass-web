import {
  Box,
  MenuItem,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";
import DeleteRowIcon from "icons/DeleteRowIcon";
import DragRowTableIcon from "icons/DragRowTableIcon";
import DuplicateRowTableIcon from "icons/DuplicateRowTableIcon";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { uuid } from "utils/index";

function BodyTable({ onDragEnd, formik, handleChange, arrService }) {
  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Droppable droppableId="table-droppable">
        {(provided, snapshot) => (
          <TableBody ref={provided.innerRef} {...provided.droppableProps}>
            {formik.values.service_items.map((row, index) => (
              <Draggable
                key={row._id}
                draggableId={String(row._id)}
                index={index}
              >
                {(provided) => (
                  <TableRow
                    key={index}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TableCell
                      sx={{
                        background: "#F7F7FD",
                        padding: 0,
                        border: "none",
                        width: "20px",
                      }}
                    >
                      <DragRowTableIcon
                        sx={{ height: "16px", width: "16px" }}
                      />
                    </TableCell>
                    {!row.typeRowTwo ? (
                      <TableCell
                        sx={{
                          color: "#495057 !important",
                          fontSize: "14px",
                          fontWeight: 400,
                          border: "1px solid #EBEAF2",
                          position: "relative",
                        }}
                        align="left"
                      >
                        <TextField
                          name={`service_items[${index}].service_name`}
                          value={row.service_name}
                          onChange={(e) =>
                            handleChange(
                              `service_items[${index}].service_name`,
                              e.target.value,
                            )
                          }
                          placeholder="Add a service name"
                          fullWidth
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            inputProps: {
                              style: { textAlign: "left" },
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-input.MuiInput-input": {
                              padding: "8px",
                            },
                          }}
                        />
                        <TextField
                          name={`service_items[${index}].description`}
                          value={row.description}
                          onChange={(e) =>
                            handleChange(
                              `service_items[${index}].description`,
                              e.target.value,
                            )
                          }
                          multiline
                          minRows={2}
                          placeholder="Add a description to your item"
                          fullWidth
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            inputProps: {
                              style: {
                                textAlign: "left",
                                color: "#838195",
                              },
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-input.MuiInput-input": {
                              borderRadius: "6px",
                              background: "#FBFAFA",
                              padding: "8px",
                            },
                            "& .MuiInputBase-input.MuiOutlinedInput-input ": {
                              "-webkit-text-fill-color": "#838195 !important",
                              fontWeight: 400,
                              fontSize: "14px",
                            },
                          }}
                        />
                        <CloseIcon
                          sx={{
                            position: "absolute",
                            right: "16px",
                            top: "30px",
                            border: "1px solid #878787",
                            borderRadius: "16px",
                            padding: "2px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleChange(
                              `service_items[${index}].service_name`,
                              "",
                            );
                            handleChange(
                              `service_items[${index}].description`,
                              "",
                            );
                          }}
                        />
                      </TableCell>
                    ) : (
                      <TableCell
                        sx={{
                          color: "#495057 !important",
                          fontSize: "14px",
                          fontWeight: 400,
                          border: "1px solid #EBEAF2",
                          position: "relative",
                        }}
                        align="left"
                      >
                        <TextField
                          select
                          value="Type or click to select an item."
                          fullWidth
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            inputProps: {
                              style: {
                                textAlign: "left",
                                opacity: 1,
                                border: "none",
                                outline: "none",
                                top: 0,
                                fontSize: "14px",
                                color: "#838195",
                              },
                            },
                          }}
                          SelectProps={{ IconComponent: () => null }}
                          sx={{
                            "& .MuiInputBase-input.MuiInput-input": {
                              padding: "8px",
                              color: "#838195",
                            },
                          }}
                        >
                          {arrService.map((service) => (
                            <MenuItem
                              key={service?.id}
                              value={service?.id}
                              onClick={() => {
                                handleChange(
                                  `service_items[${index}].service_name`,
                                  service.name,
                                );
                                handleChange(
                                  `service_items[${index}].quantity`,
                                  service.qty,
                                );
                                handleChange(
                                  `service_items[${index}].discount`,
                                  service.discount,
                                );
                                handleChange(
                                  `service_items[${index}].typeRowTwo`,
                                  false,
                                );
                                handleChange(
                                  `service_items[${index}].description`,
                                  service.desc,
                                );
                                handleChange(
                                  `service_items[${index}]._id`,
                                  service.id,
                                );
                              }}
                            >
                              {service.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                    )}
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        color: "#495057 !important",
                        fontSize: "14px",
                        fontWeight: 400,
                        border: "1px solid #EBEAF2",
                      }}
                      align="right"
                    >
                      Hour
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#495057 !important",
                        fontSize: "14px",
                        fontWeight: 400,
                        border: "1px solid #EBEAF2",
                      }}
                      align="right"
                    >
                      <TextField
                        name={`service_items[${index}].quantity`}
                        value={row.quantity}
                        type="number"
                        onChange={(e) =>
                          handleChange(
                            `service_items[${index}].quantity`,
                            e.target.value,
                          )
                        }
                        fullWidth
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: {
                            style: { textAlign: "right" },
                          },
                        }}
                        sx={{
                          "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                            {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#495057 !important",
                        fontSize: "14px",
                        fontWeight: 400,
                        border: "1px solid #EBEAF2",
                      }}
                      align="right"
                    >
                      <TextField
                        name={`service_items[${index}].rate`}
                        value={row.rate}
                        type="number"
                        fullWidth
                        onChange={(e) =>
                          handleChange(
                            `service_items[${index}].rate`,
                            e.target.value,
                          )
                        }
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: {
                            style: { textAlign: "right" },
                          },
                        }}
                        sx={{
                          "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                            {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#495057 !important",
                        fontSize: "14px",
                        fontWeight: 400,
                        border: "1px solid #EBEAF2",
                        position: "relative",
                        paddingRight: "24px",
                      }}
                      align="right"
                    >
                      <TextField
                        name={`service_items[${index}].discount`}
                        value={row.discount}
                        type="number"
                        fullWidth
                        onChange={(e) =>
                          handleChange(
                            `service_items[${index}].discount`,
                            e.target.value,
                          )
                        }
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: {
                            style: { textAlign: "right" },
                            max: 100,
                            min: 0,
                          },
                        }}
                        sx={{
                          "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                            {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          right: "4px",
                          top: "calc(50% - 10px)",
                        }}
                      >
                        %
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#495057 !important",
                        fontSize: "14px",
                        fontWeight: 400,
                        border: "1px solid #EBEAF2",
                        position: "relative",
                      }}
                      align="right"
                    >
                      {row.amount}
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "#F7F7FD",
                        padding: 0,
                        border: "none",
                        width: "50px",
                      }}
                    >
                      <Stack
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          height: "100%",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <DuplicateRowTableIcon
                          sx={{
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChange("service_items", [
                              ...formik.values.service_items,
                              {
                                ...formik.values.service_items[index],
                                _id: uuid(),
                              },
                            ])
                          }
                        />
                        <DeleteRowIcon
                          onClick={() => {
                            const listNow = formik.values.service_items;
                            listNow.splice(index, 1);
                            handleChange("service_items", listNow);
                          }}
                          sx={{
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TableBody>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default BodyTable;
