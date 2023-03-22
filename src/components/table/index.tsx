import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
import NoDataInCard from "../NoDataInCard";

function Table({ data, columns }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useExpanded);

  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table">
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
              <td colSpan={6}>
                <NoDataInCard msg={"No data to show"} />
              </td>
            </tr>
          )}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <Fragment key={rowProps.key}>
                <tr className="rowCard text-center" {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
