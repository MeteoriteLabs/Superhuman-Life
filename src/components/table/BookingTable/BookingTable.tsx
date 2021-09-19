
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useTable } from "react-table";
import { useSortBy, usePagination } from 'react-table'
import "./bookingTable.css";
import * as Icon from 'react-bootstrap-icons';
function Table({ data, columns, newPackageCount, fetchData, loading, pageCount: controlledPageCount, }: any) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageSize },
    } = useTable({
        columns, data, initialState: {
            sortBy: [
                { id: "purchase_date", desc: true },
            ],
            // pageIndex: 0,
            pageSize: 10
        },
        manualPagination: true,
        pageCount: controlledPageCount,
        isMultiSortEvent: e => {
            return true
        }
    }, useSortBy, usePagination);


    // start = (current page no - 1) x no of records per page

    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])


    const [isSort, setIsSort] = useState(false);


    const toggleSort = () => {
        setIsSort(!isSort);
        console.log(data);

        data.sort((a, b) => {
            if (new Date(a.purchase_data) > new Date(b.purchase_data)) {
                if (isSort) {
                    return 1
                }
            }

            return -1
        })



        console.log('sort data', data)
    }


    return (
        <div className="table-responsive">
            <Button variant="danger" style={{ border: '1px solid black', borderRadius: '15px' }}>
                <span className="visually-hidden">New Booking</span>
                <Badge className='bg-dark ml-3 rounded-circle' style={{ fontSize: '1rem' }}>{newPackageCount}</Badge>
            </Button>


            <pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        2
                    )}
                </code>
            </pre>
            <table {...getTableProps()} className="table text-center">
                <thead>
                    {headerGroups.map(headerGroup => {
                        return (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th className="tableHeader text-center" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <Icon.SortDown className='ml-2' />
                                                    : <Icon.SortDownAlt className='ml-2' />
                                                : ""}
                                        </span>
                                        <span>
                                            {(column.canSort && !column.isSorted) ?
                                                <Icon.Funnel className='ml-2' />
                                                : ""}
                                        </span>
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
                    {page.map(row => {
                        let purchaseDate: Date = new Date(moment(row.values.purchase_date).format('MM/DD/YYYY'));
                        let currentDate: Date = new Date(moment().format('MM/DD/YYYY'));
                        const diffTime = Math.abs(Number(purchaseDate) - Number(currentDate));
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        return (
                            <Fragment key={rowProps.key}>
                                {diffDays <= 5 ? <tr className="newBookingRowCard" style={{ backgroundColor: '#F8F9FA', border: '1px solid black' }} {...row.getRowProps()} >
                                    {row.cells.map(cell => {
                                        return <td className='bodyTd ml-3' {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    }
                                    )}
                                </tr> :
                                    <tr className="bookingRowCard " {...row.getRowProps()} >
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

                    {/* <tr>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <td colSpan={10000}>Loading...</td>
                        ) : (
                            <td colSpan={10000}>
                                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                                results
                            </td>
                        )}
                    </tr> */}
                </tbody>
            </table>

            <div className="pagination justify-content-around">
                <div>
                    <button onClick={() => {
                        setPageIndex(0)
                        gotoPage(0)
                    }} disabled={pageIndex === 0 && !canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => {
                        setPageIndex(pageIndex - 1);
                        previousPage()
                    }} disabled={pageIndex === 0 && !canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => {
                        setPageIndex(pageIndex + 1);
                        nextPage()
                    }} 
                    // disabled={data.length <= pageSize }
                    >
                        {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Go to page:{' '}
                        <input
                            type="number"
                            min="1"
                            // defaultValue={pageIndex + 1}
                            onChange={e => {
                                let page = 0;
                                page = Number(e.target.value) === 0 ? 0 : Number(e.target.value) - 1
                                setPageIndex(page)

                                console.log('page', page)
                                // gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>{' '}
                </div>

                <div className='d-flex justify-content-center align-items-center'>
                    <p className='mb-0 mr-3'>
                        Show
                    </p>
                    <select
                        value={pageSize}
                        onChange={e => {

                            setPageSize(Number(e.target.value));

                        }}
                    >
                        {[10, 20, 30, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} rows
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

    );
}

export default Table;