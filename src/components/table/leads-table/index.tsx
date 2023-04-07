import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
import NoDataInCard from "../../NoDataInCard";
import "./leads.css";

function Table({ data, columns }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useExpanded);

  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <th className="tableHeader" {...column.getHeaderProps()} key={index}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr className="rowCard text-center">
              <td colSpan={columns.length}>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => (
                    <td {...cell.getCellProps()} key={index}>{cell.render("Cell")}</td>
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
