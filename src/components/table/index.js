import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";

function Table({ renderRowSubComponent, data, columns }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
    } = useTable({ columns, data }, useExpanded);

    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                                {row.isExpanded &&
                                    renderRowSubComponent({ row, rowProps, visibleColumns })}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;