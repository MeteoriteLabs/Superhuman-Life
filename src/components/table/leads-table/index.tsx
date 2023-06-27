import { Fragment } from 'react'
import { useTable, useExpanded } from 'react-table'
import NoDataInCard from '../../NoDataInCard'
import './leads.css'

function Table({ data, columns }: any): JSX.Element {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data },
        useExpanded
    )

    function createUniqueKey() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const length = 10
        let key = ''

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length)
            key += chars.charAt(randomIndex)
        }

        return key
    }
    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={createUniqueKey()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    className="tableHeader"
                                    {...column.getHeaderProps()}
                                    key={createUniqueKey()}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                    {!rows.length && (
                        <tr className="rowCard text-center">
                            <td colSpan={columns.length}>
                                <NoDataInCard msg={'No data to show'} />
                            </td>
                        </tr>
                    )}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        const rowProps = row.getRowProps()
                        return (
                            <Fragment key={rowProps.key}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell, index) => (
                                        <td {...cell.getCellProps()} key={index}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Table
