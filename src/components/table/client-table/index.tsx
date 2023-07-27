import { Fragment } from 'react';
import { useTable, useExpanded } from 'react-table';
import NoDataInCard from 'components/NoDataInCard';
import './client-table.css';

function ClientTable({ data, columns }: any) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data },
        useExpanded
    );

    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table">
                <thead className="tableHeader">
                    {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, index) => (
                                <th
                                    className="tableHeader"
                                    {...column.getHeaderProps()}
                                    key={index}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                    {!rows.length && (
                        <tr className="rowCard text-center">
                            <td colSpan={10}>
                                <NoDataInCard msg={'No data'} />{' '}
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
                                <tr className="rowCard" {...row.getRowProps()}>
                                    {row.cells.map((cell, index) => (
                                        <td {...cell.getCellProps()} key={index}>
                                            {cell.render('Cell')}
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

export default ClientTable;
