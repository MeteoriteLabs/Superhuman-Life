import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
    GET_EARNINGS_TRANSACTIONS,
    GET_EXPENSES_TRANSACTIONS,
    GET_USERS_JOINED_DATE
} from './Queries'
import { Row, Col, Card } from 'react-bootstrap'
import { flattenObj } from '../../../components/utils/responseFlatten'
import AuthContext from '../../../context/auth-context'
import FinanceGraph from './FinanceGraph'
import moment from 'moment'
import './Summary.css'

const Summary: React.FC = () => {
    const auth = useContext(AuthContext)
    const [totalRevenue, setTotalRevenue] = useState<number>(0)
    const [totalEarning, setTotalEarning] = useState<number>(0)
    const [totalExpenses, setTotalExpenses] = useState<number>(0)
    const [joinedYear, setJoinedYear] = useState<string>('')
    const [selectedMonthYear, setSelectedMonthYear] = useState<string>(moment().format('YYYY-MM'))

    const [
        getEarnings,
        {
            // eslint-disable-next-line
            data: get_earnings_transaction
        }
    ] = useLazyQuery(GET_EARNINGS_TRANSACTIONS, {
        fetchPolicy: 'cache-and-network',

        onCompleted: (data) => {
            const initialEarningsValue = 0
            const initialRevenueValue = 0

            const flattenEarningsTransactionsData = flattenObj({
                ...data.transactions
            })

            // Earnings
            const selectedMonthsEarnings = flattenEarningsTransactionsData
                .filter(
                    (currentValue) =>
                        moment.utc(currentValue.TransactionDateTime).format('YYYY-MM') ===
                        selectedMonthYear
                )
                .reduce(
                    (accumulator, currentValue) => accumulator + currentValue.ChangemakerAmount,
                    initialEarningsValue
                )

            // Revenue
            const selectedMonthsRevenue = flattenEarningsTransactionsData
                .filter(
                    (currentValue) =>
                        moment.utc(currentValue.TransactionDateTime).format('YYYY-MM') ===
                        selectedMonthYear
                )
                .reduce(
                    (accumulator, currentValue) => accumulator + currentValue.TransactionAmount,
                    initialRevenueValue
                )

            setTotalRevenue(selectedMonthsRevenue)
            setTotalEarning(selectedMonthsEarnings)
        }
    })

    const [
        getExpenses,
        {
            // eslint-disable-next-line
            data: get_expenses_transaction
        }
    ] = useLazyQuery(GET_EXPENSES_TRANSACTIONS, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network',

        onCompleted: () => {
            const flattenExpensesTransactionsData = flattenObj({
                ...get_expenses_transaction?.transactions
            })

            const initialExpensesValue = 0

            const selectedMonthsExpenses =
                flattenExpensesTransactionsData &&
                flattenExpensesTransactionsData.length &&
                flattenExpensesTransactionsData
                    .filter(
                        (currentValue) =>
                            moment.utc(currentValue.TransactionDateTime).format('YYYY-MM') ===
                            selectedMonthYear
                    )
                    .reduce(
                        (accumulator, currentValue) => accumulator + currentValue.TransactionAmount,
                        initialExpensesValue
                    )

            setTotalExpenses(selectedMonthsExpenses)
            getUsersJoinedDate({ variables: { id: auth.userid } })
        }
    })

    const [
        getUsersJoinedDate,
        {
            // eslint-disable-next-line
            data: get_users_joined_date
        }
    ] = useLazyQuery(GET_USERS_JOINED_DATE, {
        onCompleted: (data) => {
            const flattenUsersData = flattenObj({
                ...data.usersPermissionsUser
            })
            const accountCreatedAt = moment(flattenUsersData.createdAt).format('YYYY')
            setJoinedYear(accountCreatedAt)
        }
    })

    useEffect(() => {
        getEarnings({
            variables: {
                receiverId: auth.userid
            }
        })

        getExpenses({
            variables: {
                senderId: auth.userid
            }
        })

        getUsersJoinedDate({ variables: { id: auth.userid } })

        // eslint-disable-next-line
    }, [selectedMonthYear])

    return (
        <>
            <div className="mt-5">
                <Row>
                    <Col lg={2} sm={12}>
                        <b>
                            <label>Select Month </label>
                        </b>
                    </Col>
                    <Col>
                        <input
                            className="date__input"
                            id="finance-month"
                            type="month"
                            name="finance-month"
                            min={`${joinedYear}-01`}
                            max={moment().format('YYYY-MM')}
                            onChange={(e) => {
                                setSelectedMonthYear(
                                    moment(`${e.target.value}-01`).format('YYYY-MM')
                                )

                                getEarnings({
                                    variables: {
                                        receiverId: auth.userid
                                    }
                                })

                                getExpenses({
                                    variables: {
                                        senderId: auth.userid
                                    }
                                })
                            }}
                            defaultValue={moment().format('YYYY-MM')}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mt-5">
                <Row>
                    {/* Revenue */}
                    <Col lg={4} xs={12}>
                        <Card className="p-2 m-2">
                            <Row>
                                <Col lg={9} xs={10}>
                                    <b>Revenue</b>
                                </Col>
                                <Col xs={2}>
                                    <img src="assets/summary/netProfit.svg" alt="profit" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b style={{ fontSize: '20px' }}>INR {totalRevenue}</b>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Earnings */}
                    <Col lg={4}>
                        <Card className="p-2 m-2">
                            <Row>
                                <Col lg={9} xs={10}>
                                    <b>Earnings</b>
                                </Col>
                                <Col>
                                    <img src="assets/summary/earnings.svg" alt="earnings" />
                                </Col>
                            </Row>
                            <b style={{ fontSize: '20px' }}>INR {totalEarning}</b>
                        </Card>
                    </Col>

                    {/* Expenses */}
                    <Col lg={4}>
                        <Card className="p-2 m-2">
                            <Row>
                                <Col lg={9} xs={10}>
                                    <b>Expenses</b>
                                </Col>
                                <Col>
                                    <img src="assets/summary/expenses.svg" alt="expenses" />
                                </Col>
                            </Row>
                            <b style={{ fontSize: '20px' }}>INR {totalExpenses}</b>
                        </Card>
                    </Col>
                </Row>
            </div>
            <FinanceGraph />
        </>
    )
}

export default Summary
