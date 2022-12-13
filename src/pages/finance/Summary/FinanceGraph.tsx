import { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS_GRAPH,
  GET_EXPENSES_TRANSACTIONS_GRAPH,
  GET_USERS_JOINED_DATE,
} from "./Queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { Row, Col } from "react-bootstrap";

function FinanceGraph() {
  const [financeData, setFinanceData] = useState<any>([]);
  const auth = useContext(AuthContext);
  const [joinedYearArray, setJoinedYearArray] = useState<number[]>();
  const [selectedYear, setSelectedYear] = useState<number>(
    Number(moment().format("YYYY"))
  );

  const currentYear = new Date().getFullYear();

  const [
    getEarnings,
    {
      // eslint-disable-next-line
      data: get_earnings_transaction,
    },
  ] = useLazyQuery(GET_EARNINGS_TRANSACTIONS_GRAPH, {
    fetchPolicy: "cache-and-network",
    onCompleted: () => {
      getExpenses({
        variables: {
          senderId: auth.userid,
          transactionStartTime: moment(`01/01/${currentYear}`).format(),
          transactionEndTime: moment().format(),
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

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  }

  const loadData = (data) => {
    const flattenEarningsTransactionsData = flattenObj({
      ...get_earnings_transaction?.transactions,
    });

    const flattenExpensesTransactionsData = flattenObj({
      ...get_expenses_transaction?.transactions,
    });

    const flattenUsersData = flattenObj({
      ...data.usersPermissionsUser,
    });

    const accountCreatedAt = moment(flattenUsersData.createdAt).format("YYYY");
    const arr: any = [];

    for (
      let i = Number(accountCreatedAt);
      i <= Number(moment().format("YYYY"));
      i++
    ) {
      arr.push(i);
    }
    setJoinedYearArray(arr);

    const earningsArray: any[] = [];
    const revenueArray: any[] = [];
    const expensesArray: any[] = [];

    const initialEarningsValue = 0;
    const initialRevenueValue = 0;
    const initialExpensesValue = 0;

    for (let month = 0; month < 12; month++) {
      let currentMonth = toMonthName(month).substring(0, 3);
      earningsArray[month] = {
        x: `${currentMonth} ${selectedYear}`,
        y:
          flattenEarningsTransactionsData &&
          flattenEarningsTransactionsData.length &&
          flattenEarningsTransactionsData
            .filter(
              (currentValue) =>
                moment(currentValue.TransactionDateTime).format("MM/YY") ===
                moment(`01/${currentMonth}/${selectedYear}`).format("MM/YY")
            )
            .reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.ChangemakerAmount,
              initialEarningsValue
            ),
      };

      revenueArray[month] = {
        x: `${currentMonth} ${selectedYear}`,
        y:
          flattenEarningsTransactionsData &&
          flattenEarningsTransactionsData.length &&
          flattenEarningsTransactionsData
            .filter(
              (currentValue) =>
                moment(currentValue.TransactionDateTime).format("MM/YY") ===
                moment(`01/${currentMonth}/${selectedYear}`).format("MM/YY")
            )
            .reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.TransactionAmount,
              initialRevenueValue
            ),
      };

      expensesArray[month] = {
        x: `${currentMonth} ${selectedYear}`,
        y:
          flattenExpensesTransactionsData &&
          flattenExpensesTransactionsData.length &&
          flattenExpensesTransactionsData
            .filter(
              (currentValue) =>
                moment(currentValue.TransactionDateTime).format("MM/YY") ===
                moment(`01/${currentMonth}/${selectedYear}`).format("MM/YY")
            )
            .reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.TransactionAmount,
              initialExpensesValue
            ),
      };
    }

    setFinanceData([
      {
        id: "Earnings",
        color: "hsl(235, 70%, 50%)",
        data: earningsArray,
      },
      {
        id: "Revenue",
        color: "hsl(235, 70%, 50%)",
        data: revenueArray,
      },
      {
        id: "Expenses",
        color: "hsl(68, 70%, 50%)",
        data: expensesArray,
      },
    ]);
  };

  useEffect(() => {
    getEarnings({
      variables: {
        recieverId: auth.userid,

        transactionStartTime: moment().subtract(1, "years").format(),
        transactionEndTime: moment().format(),
      },
    });
    //eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setSelectedYear(e.target.value);

    getEarnings({
      variables: {
        recieverId: auth.userid,

        transactionStartTime: moment(`01/01/${e.target.value}`).format(),
        transactionEndTime: moment(`01/12/${e.target.value}`).format(),
      },
    });
  };

  return (
    <>
      <Row className="m-5">
        <Col className="text-center">
          <span>
            <b className="mr-3">Select Year</b>
            <select
              value={selectedYear || moment().format("YYYY")}
              onChange={(e) => {
                handleChange(e);
              }}
              style={{ padding: "5px", borderRadius: "5px", width: "20vw" }}
            >
              {joinedYearArray?.map((currentValue, index) => (
                <option key={index}>{currentValue} </option>
              ))}
            </select>
          </span>
        </Col>
      </Row>

      <Row>
        <Col style={{ overflowX: "scroll" }}>
          <LineGraph
            data={financeData}
            yAxis={"Transaction amount (INR)"}
            title={"Finance Monthly Graph"}
          />
        </Col>
      </Row>
    </>
  );
}

export default FinanceGraph;
