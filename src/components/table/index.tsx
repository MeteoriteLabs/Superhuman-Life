import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
import "./table.css";
function Table({ data, columns }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useExpanded);

    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table text-center">
                <thead>
                    {headerGroups.map(headerGroup => {
                        console.log(headerGroup)
                        return (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th className="tableHeader text-center" {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>

                        )
                    })}
                    {!rows.length &&
                        <tr className="rowCard text-center">
                            <td colSpan={columns.length}>No data</td>
                        </tr>
                    }
                </thead>
                <tbody  {...getTableBodyProps()}>
                    {rows.map(row => {
                        console.log(row)
                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                <tr className="rowCard" {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td className='bodyTd ml-3' {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
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