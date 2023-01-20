
import { useTable } from "react-table";
import "./groupTable.css";





function GroupTable({ data, columns }: any) {

    function useInstance(instance) {
        const { allColumns } = instance;

        let rowSpanHeaders: any[] = [];

        allColumns.forEach((column: any, i: any) => {

            const { id, enableRowSpan } = column;



            if (enableRowSpan !== undefined) {
                rowSpanHeaders = [
                    ...rowSpanHeaders,
                    { id, topCellValue: null, topCellIndex: 0 }
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
    }: any = useTable({ columns, data }, hooks => {
        hooks.useInstance.push(useInstance);
    });

    let headerIndex = 0
    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="group table text-center">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th className="tableHeader text-center" {...column.getHeaderProps()} >
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
                <tbody {...getTableBodyProps()}>

                    {rows.forEach((row, i) => {
                        prepareRow(row);
                
                        let samePackage = false
                        if (i > 0) {
                            samePackage = (rows[i - 1].original.id === row.original.id) ? true : false
                        }

                        if (!samePackage) {
                            headerIndex = i;
                        }

                        for (let j = 0; j < row.cells.length; j++) {
                            let cell = row.allCells[j];
                            if (!samePackage || j > 4) {
                          
                                cell.isRowSpanned = false;
                                cell.rowSpan = 1
                            } else {
                                rows[headerIndex].allCells[j].rowSpan++
                                cell.isRowSpanned = true;
                            }
                        }
                     
                  
                    })}
                    {rows.map(row => {
                        return (
                            <tr className="rowCard" {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.isRowSpanned) return null;
                                    else
                                        return (
                                            <td
                                               
                                                className='bodyTd ml-3 relative'
                                                rowSpan={cell.rowSpan}
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default GroupTable;