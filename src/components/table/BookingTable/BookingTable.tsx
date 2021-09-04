import moment from "moment";
import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
import "./bookingTable.css";
function Table({ data, columns }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useExpanded);

    console.log('table')
    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table text-center">
                <thead>
                    {headerGroups.map(headerGroup => {
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
                        let purchaseDate: any = new Date(moment(row.values.purchase_date).format('MM/DD/YYYY'));
                        let currentDate: any = new Date(moment().format('MM/DD/YYYY'));
                        const diffTime = Math.abs(purchaseDate - currentDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                {diffDays <= 5 ? <tr className="rowCard bg-info " {...row.getRowProps()} >
                                    {row.cells.map(cell => {
                                        return <td className='bodyTd ml-3' {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    }
                                    )}
                                </tr> :
                                    <tr className="rowCard " {...row.getRowProps()} >
                                        {row.cells.map(cell => {
                                            return <td className='bodyTd ml-3' {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        }
                                        )}
                                    </tr>
                                }
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;