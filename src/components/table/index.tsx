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
            <table {...getTableProps()} className="table">
                <thead >
                    {headerGroups.map(headerGroup => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th className="tableHeader border-0 text-center" {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    {!rows.length &&
                        <tr className="rowCard text-center">
                            <td colSpan={columns.length}>No data</td>
                        </tr>
                    }
                </thead>
                <tbody  {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr className="rowCard" {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td
                                            className='bodyTd ml-3'
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    )
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;