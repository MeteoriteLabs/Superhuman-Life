import { useTable } from "react-table";
import NoDataInCard from "../../NoDataInCard";
import "./ptTable.css";

function PTTable({ data, columns }: any) {
  function useInstance(instance) {
    const { allColumns } = instance;

    let rowSpanHeaders: any[] = [];

    allColumns.forEach((column: any, i: any) => {
      const { id, enableRowSpan } = column;

      if (enableRowSpan) {
        rowSpanHeaders = [
          ...rowSpanHeaders,
          { id, topCellValue: null, topCellIndex: 0 },
        ];
      }
    });

    Object.assign(instance, { rowSpanHeaders });
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  }: any = useTable({ columns, data }, (hooks) => {
    hooks.useInstance.push(useInstance);
  });

  let currentRowsIndex = 0;
  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="pt table text-center">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="tableHeader text-center"
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr className="rowCard text-center">
              <td colSpan={8}>
                <NoDataInCard msg={"No data"} />{" "}
              </td>
            </tr>
          )}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.forEach((row, i) => {
            prepareRow(row);

            let samePackage = false;

            if (!samePackage) {
              currentRowsIndex = i;
            }

            for (let j = 0; j < row.cells.length; j++) {
              let cell = row.allCells[j];

              if (!samePackage || j > 4) {
                cell.rowSpan = 1;
                cell.isRowSpanned = false;
              } else {
                cell.isRowSpanned = true;
                rows[currentRowsIndex].allCells[j].rowSpan++;
              }

              // if (rowSpanHeader !== undefined) {
              //     if (rowSpanHeader.topCellValue === null || rowSpanHeader.topCellValue !== cell.value   ) {
              //         cell.isRowSpanned = false;
              //         rowSpanHeader.topCellValue = cell.value;
              //         rowSpanHeader.topCellIndex = i;
              //         cell.rowSpan = 1;
              //     } else {
              //         cell.isRowSpanned = true;
              //         rows[rowSpanHeader.topCellIndex].allCells[j].rowSpan++;
              //     }
              // }
            }
          })}
          {rows.map((row) => {
            return (
              <tr className="rowCard" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.isRowSpanned) return null;
                  else {
                    return (
                      <td
                        rowSpan={cell.rowSpan}
                        className="bodyTd ml-3"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PTTable;
