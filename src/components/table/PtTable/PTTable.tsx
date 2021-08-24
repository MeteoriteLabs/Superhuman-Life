import { Fragment } from "react";
import { useTable, useExpanded } from "react-table";





function PTTable({ data, columns }: any) {

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
        rowSpanHeaders
    }: any = useTable({ columns, data }, hooks => {
        hooks.useInstance.push(useInstance);
    });

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
                    {/* {rows.map((row: { cells: string | any[]; allCells: any[]; }) => {
                        prepareRow(row);
                        console.log('rows', rows);
                        for (let i = 0; i < row.cells.length; i++) {
                            let cell = row.allCells[i];
                            if( cell.value === "Package Name 1"){
                                cell.isRowSpanned = true;
                                rows[0].allCells[i].rowSpan = 3
                            }
                        }
                    })} */}
                    {rows.map((row, i) => {
                        prepareRow(row);
                   
                        for (let j = 0; j < row.cells.length; j++) {
                            let cell = row.allCells[j];
                            let rowSpanHeader = rowSpanHeaders.find(  x => x.id === cell.column.id );

                          

                            if (rowSpanHeader !== undefined) {
                                if (rowSpanHeader.topCellValue === null || rowSpanHeader.topCellValue !== cell.value   ) {
                                    cell.isRowSpanned = false;
                                    rowSpanHeader.topCellValue = cell.value;
                                    rowSpanHeader.topCellIndex = i;
                                    cell.rowSpan = 1;
                                } else {
                                    cell.isRowSpanned = true;
                                    rows[rowSpanHeader.topCellIndex].allCells[j].rowSpan++;
                                }
                            }
                        }
                        return null;
                    })}
                    {rows.map(row => {
                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                <tr className="rowCard" {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td  className='bodyTd ml-3' {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        )
                                    }
                                    )}
                                </tr>
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


export default PTTable