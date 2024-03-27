/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node as ProseMirrorNode, Fragment, Schema } from "prosemirror-model";
import { getTableNodeTypes } from "./getTableNodeType";
import { createCell } from "./createCell";

export function createTable(
  schema: Schema,
  rowsCount: number,
  colsCount: number,
  withHeaderRow: boolean,
  cellContent?: Fragment | ProseMirrorNode | Array<ProseMirrorNode>
): ProseMirrorNode {
  const types = getTableNodeTypes(schema);
  const headerCells = [];
  const cells = [];

  for (let index = 0; index < colsCount; index += 1) {
    const cell  = createCell(types.cell, cellContent);

    if (cell) {
      cells.push(cell as unknown as never);
    }

    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);

      if (headerCell) {
        headerCells.push(headerCell as unknown as never);
      }
    }
  }

  const rows = [];

  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(
      types.row.createChecked(
        null,
        withHeaderRow && index === 0 ? headerCells : cells
      ) as unknown as never
    );
  }

  return types.table.createChecked(null, rows);
}
