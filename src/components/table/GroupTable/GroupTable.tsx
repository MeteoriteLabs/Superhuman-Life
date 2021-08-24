import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";
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

        // console.log(column)

        // console.log("🚀 ~ file: GroupTable.tsx ~ line 19 ~ allColumns.forEach ~ id", id)

        //   const id = allColumns[0].id
        //   const {enableRowSpan} = allColumns[0]

        //   if (enableRowSpan !== undefined) {
        //       rowSpanHeaders = [
        //           ...rowSpanHeaders,
        //           { id, topCellValue: null, topCellIndex: 0 }
        //       ];
        //   }
        Object.assign(instance, { rowSpanHeaders });

    }


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        rowSpanHeaders
    }: any = useTable({ columns, data }, hooks => {
        hooks.useInstance.push(useInstance);
    });

    let headerIndex = 0
    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table text-center">
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
                  
                    { rows.map((row, i) => {
                        prepareRow(row);
                        console.log('row', row)
                        let samePackage = true;
                        if (i > 0) {

                            samePackage = (row.original.id === rows[i - 1].original.id) ? true : false;
                            console.log(headerIndex, samePackage, row.original.id, rows[i-1].original.id);
                        }
                        if (!samePackage) {
                            headerIndex = i;
                        }
                        for (let j = 0; j < row.cells.length; j++) {
                            let cell = row.allCells[j];
                            
                            // let rowSpanHeader = rowSpanHeaders.find(x => x.id === cell.column.id);
                            // // console.log('rowSpanHeaders', rowSpanHeaders)
                            // // console.log('cell',cell)

                            // const rowSpanvalue = rowSpanHeaders[0].topCellValue; // id = 1/2
                            // // const rowSpanvalue1 = rowSpanHeaders[1].topCellValue; // packageName


                            // if (rowSpanHeader !== undefined ) {
                            //     if (rowSpanHeader.topCellValue === null || rowSpanHeader.topCellValue !== cell.value) {
                            if (!samePackage) {
                                cell.isRowSpanned = false;
                                // rowSpanHeader.topCellValue = cell.value;
                                // rowSpanHeader.topCellIndex = i;
                                cell.rowSpan = 1;

                            } else {
                                rows[headerIndex].allCells[j].rowSpan++;
                                cell.isRowSpanned = true;
                            }
                        }

                        // return null;
                    // }
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