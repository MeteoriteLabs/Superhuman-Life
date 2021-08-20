import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
import "./groupTable.css";





function GroupTable({ data, columns }: any) {

    function useInstance(instance) {
        const { allColumns } = instance;

        let rowSpanHeaders:any[] = [];

        allColumns.forEach((column:any, i:any) => {
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
        rowSpanHeaders
    }:any = useTable({ columns, data }, hooks => {
        hooks.useInstance.push(useInstance);
    });

    return (
        <div className="table-responsive">
            <table {...getTableProps()}  className="table text-center">
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
                    {rows.map((row, i) => {
                        prepareRow(row);
                        console.log('row' ,row)
                        
                        for (let j = 0; j < row.cells.length; j++) {
                            let cell = row.allCells[j];
                            let rowSpanHeader = rowSpanHeaders.find(
                                x => x.id === cell.column.id
                            );

                            if (rowSpanHeader !== undefined) {
                                if (
                                    rowSpanHeader.topCellValue === null ||
                                    rowSpanHeader.topCellValue !== cell.value
                                ) {
                                    cell.isRowSpanned = false;
                                    rowSpanHeader.topCellValue = cell.value;
                                    rowSpanHeader.topCellIndex = i;
                                    cell.rowSpan = 1;
                                } else {
                                    rows[rowSpanHeader.topCellIndex].allCells[j].rowSpan++;
                                    cell.isRowSpanned = true;
                                }
                            }
                        }
                        return null;
                    })}
                    {rows.map(row => {
                        return (
                            <tr className="rowCard" {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.isRowSpanned) return null;
                                    else
                                        return (
                                            <td
                                            className='bodyTd ml-3'
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