import { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS_GRAPH,
  GET_EXPENSES_TRANSACTIONS_GRAPH,
  GET_USERS_JOINED_DATE,
} from "./Queries";
import { Row, Col, Card } from "react-bootstrap";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import FinanceGraph from "./FinanceGraph";
import moment from "moment";
import './Summary.css';

function Summary() {
  const auth = useContext(AuthContext);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalEarning, setTotalEarning] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [joinedYear, setJoinedYear] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<any>(
    moment().format("YYYY-MM")
  );

  const [
    getEarnings,
    {
      // eslint-disable-next-line
      data: get_earnings_transaction,
    },
  ] = useLazyQuery(GET_EARNINGS_TRANSACTIONS_GRAPH, {
    variables: {
      receiverId: auth.userid,
    },
    onCompleted: (data) => {
      const initialEarningsValue = 0;
      const initialRevenueValue = 0;

      const flattenEarningsTransactionsData = flattenObj({
        ...data.transactions,
      });

      const selectedMonthsEarnings = flattenEarningsTransactionsData
        .filter((currentValue) => {
          return (
            moment.utc(currentValue.TransactionDateTime).format("YYYY-MM") ===
            selectedMonthYear
          );
        })
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.ChangemakerAmount,
          initialEarningsValue
        );

      const selectedMonthsRevenue = flattenEarningsTransactionsData
        .filter((currentValue) => {
          return (
            moment.utc(currentValue.TransactionDateTime).format("YYYY-MM") ===
            selectedMonthYear
          );
        })
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.TransactionAmount,
          initialRevenueValue
        );

      setTotalRevenue(selectedMonthsRevenue);
      setTotalEarning(selectedMonthsEarnings);

      getExpenses({
        variables: {
          senderId: auth.userid,
        },
      });
    },
  });

  const [
    getExpenses,
    {
      // eslint-disable-next-line
      data: get_expenses_transaction,
    },
  ] = useLazyQuery(GET_EXPENSES_TRANSACTIONS_GRAPH, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      getUsersJoinedDate({ variables: { id: auth.userid } });
    },
  });

  const [
    getUsersJoinedDate,
    {
      // eslint-disable-next-line
      data: get_users_joined_date,
    },
  ] = useLazyQuery(GET_USERS_JOINED_DATE, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenExpensesTransactionsData = flattenObj({
      ...get_expenses_transaction?.transactions,
    });

    const flattenUsersData = flattenObj({
      ...data.usersPermissionsUser,
    });

    console.log("expenses array", flattenExpensesTransactionsData);
    const initialExpensesValue = 0;
    const accountCreatedAt = moment(flattenUsersData.createdAt).format("YYYY");
    setJoinedYear(accountCreatedAt);

    const selectedMonthsExpenses = flattenExpensesTransactionsData
      .filter((currentValue) => {
        console.log(
          moment.utc(currentValue.TransactionDateTime).format("YYYY-MM"),
          selectedMonthYear
        );

        return (
          moment.utc(currentValue.TransactionDateTime).format("YYYY-MM") ===
          selectedMonthYear
        );
      })
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.TransactionAmount,
        initialExpensesValue
      );

    setTotalExpenses(selectedMonthsExpenses);
  };

  useEffect(() => {
    getEarnings({
      variables: {
        receiverId: auth.userid,
      },
    });
    //eslint-disable-next-line
  }, []);

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
              className= "date__input"
              id= "finance-month"
              type= "month"
              name= "finance-month"
              min={`${joinedYear}-01`}
              max={moment().format("YYYY-MM")}
              onChange={(e) => {
                setSelectedMonthYear(
                  moment(`${e.target.value}-01`).format("YYYY-MM")
                );
                console.log(e.target.value);
                getEarnings({
                  variables: {
                    receiverId: auth.userid,
                  },
                });
                getExpenses({
                  variables: {
                    senderId: auth.userid,
                  },
                });
              }}
              defaultValue={moment().format("YYYY-MM")}
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
                  <b style={{ fontSize: "20px" }}>INR {totalRevenue}</b>
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
              <b style={{ fontSize: "20px" }}>INR {totalEarning}</b>
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
              <b style={{ fontSize: "20px" }}>INR {totalExpenses}</b>
            </Card>
          </Col>
        </Row>
      </div>
      <FinanceGraph />
    </>
  );
}

export default Summary;
