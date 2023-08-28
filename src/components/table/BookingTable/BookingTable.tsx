import moment from 'moment';
import { Fragment } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useTable } from 'react-table';
import { useSortBy, usePagination } from 'react-table';
import './bookingTable.css';
import * as Icon from 'react-bootstrap-icons';
import NoDataInCard from 'components/NoDataInCard';

function Table({ data, columns, newPackageCount }: any): JSX.Element {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [{ id: 'purchase_date', desc: true }]
            },

            isMultiSortEvent: () => {
                return true;
            }
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="table-responsive">
            <Button variant="danger" style={{ border: '1px solid black', borderRadius: '15px' }}>
                <span className="visually-hidden">New Booking</span>
                <Badge className="bg-dark ml-3 rounded-circle" style={{ fontSize: '1rem' }}>
                    {newPackageCount}
                </Badge>
            </Button>

            <table {...getTableProps()} className="table text-center">
                <thead>
                    {headerGroups.map((headerGroup, index) => {
                        return (
                            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <th
                                        className="tableHeader text-center"
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        key={index}
                                    >
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <Icon.SortDown className="ml-2" />
                                                ) : (
                                                    <Icon.SortDownAlt className="ml-2" />
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                        <span>
                                            {column.canSort && !column.isSorted ? (
                                                <Icon.Funnel className="ml-2" />
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        );
                    })}
                    {!rows.length && (
                        <tr className="rowCard text-center">
                            <td></td>
                            <td colSpan={columns.length}>
                                <NoDataInCard msg={'No data to show'} />
                            </td>
                        </tr>
                    )}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                        const bookingDate: Date = new Date(
                            moment(row.values.booking_date).format('MM/DD/YYYY')
                        );
                        const currentDate: Date = new Date(moment().format('MM/DD/YYYY'));
                        const diffTime = Math.abs(Number(bookingDate) - Number(currentDate));
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                {diffDays <= 5 ? (
                                    <tr
                                        className="newBookingRowCard"
                                        style={{
                                            backgroundColor: '#F8F9FA',
                                            border: '10px solid black'
                                        }}
                                        {...row.getRowProps()}
                                    >
                                        {row.cells.map((cell, index) => {
                                            return (
                                                <td
                                                    className="bodyTd ml-3"
                                                    {...cell.getCellProps()}
                                                    key={index}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ) : (
                                    <tr className="bookingRowCard " {...row.getRowProps()}>
                                        {row.cells.map((cell, index) => {
                                            return (
                                                <td
                                                    className="bodyTd ml-3"
                                                    {...cell.getCellProps()}
                                                    key={index}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}

                </tbody>
            </table>
        </div>
    );
}

export default Table;
