import { useContext, useEffect, useState, ChangeEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS,
  GET_EXPENSES_TRANSACTIONS,
  GET_USERS_JOINED_DATE,
} from "./Queries";
import { Row, Col } from "react-bootstrap";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import moment from "moment";

interface ArrayType {
  x: string;
  y: number;
}

function FinanceGraph() {
  const [earningsData, setEarningsData] = useState<ArrayType[]>([]);
  const [expensesData, setExpensesData] = useState<ArrayType[]>([]);
  const [revenueData, setRevenueData] = useState<ArrayType[]>([]);
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
  ] = useLazyQuery(GET_EARNINGS_TRANSACTIONS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const flattenEarningsTransactionsData = flattenObj({
        ...data.transactions,
      });
      const earningsArray: ArrayType[] = [];
      const revenueArray: ArrayType[] = [];
      const initialEarningsValue: number = 0;
      const initialRevenueValue: number = 0;

      for (let month: number = 0; month < 12; month++) {
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
                  moment(`${selectedYear}-${month + 1}-01`).format("MM/YY")
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
                  moment(`${selectedYear}-${month + 1}-01`).format("MM/YY")
              )
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.TransactionAmount,
                initialRevenueValue
              ),
        };

        setEarningsData(earningsArray);
        setRevenueData(revenueArray);
      }
    },
  });

  const [
    getExpenses,
    {
      // eslint-disable-next-line
      data: get_expenses_transaction,
    },
  ] = useLazyQuery(GET_EXPENSES_TRANSACTIONS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const flattenExpensesTransactionsData = flattenObj({
        ...data.transactions,
      });

      const expensesArray: ArrayType[] = [];
      let initialExpensesValue = 0;

      for (let month = 0; month < 12; month++) {
        let currentMonth = toMonthName(month).substring(0, 3);

        expensesArray[month] = {
          x: `${currentMonth} ${selectedYear}`,
          y:
            flattenExpensesTransactionsData &&
            flattenExpensesTransactionsData.length &&
            flattenExpensesTransactionsData
              .filter((currentValue) => {
                console.log(
                  moment(currentValue.TransactionDateTime).format("MM/YY"),
                  moment(`${selectedYear}-${month + 1}-01`).format("MM/YY")
                );
                return (
                  moment(currentValue.TransactionDateTime).format("MM/YY") ===
                  moment(`${selectedYear}-${month + 1}-01`).format("MM/YY")
                );
              })
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.TransactionAmount,
                initialExpensesValue
              ),
        };
      }

      setExpensesData(expensesArray);
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
      const flattenUsersData = flattenObj({
        ...data.usersPermissionsUser,
      });

      const accountCreatedAt = moment(flattenUsersData.createdAt).format(
        "YYYY"
      );
      const arr: number[] = [];

      for (
        let i = Number(accountCreatedAt);
        i <= Number(moment().format("YYYY"));
        i++
      ) {
        arr.push(i);
      }
      setJoinedYearArray(arr);
    },
  });

  function toMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  }

  useEffect(() => {
    getEarnings({
      variables: {
        receiverId: auth.userid,
        transactionStartTime: moment(`${currentYear}-01-01`).format(),
        transactionEndTime: moment(`${currentYear}-12-31`).format(),
      },
    });

    getExpenses({
      variables: {
        senderId: auth.userid,
        transactionStartTime: moment(`${currentYear}-01-01`).format(),
        transactionEndTime: moment(`${currentYear}-12-31`).format(),
      },
    });

    getUsersJoinedDate({ variables: { id: auth.userid } });

    //eslint-disable-next-line
  }, []);

  const selectYearChangeHandler = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedYear(Number(event.target.value));

    getEarnings({
      variables: {
        receiverId: auth.userid,
        transactionStartTime: moment(`${event.target.value}-01-01`).format(),
        transactionEndTime: moment(`${event.target.value}-12-31`).format(),
      },
    });

    getExpenses({
      variables: {
        senderId: auth.userid,
        transactionStartTime: moment(`${event.target.value}-01-01`).format(),
        transactionEndTime: moment(`${event.target.value}-12-31`).format(),
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
              onChange={(e) => selectYearChangeHandler(e)}
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "20vw",
                cursor: "pointer",
              }}
            >
              {joinedYearArray?.map((currentValue, index) => (
                <option
                  key={index}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    width: "20vw",
                    cursor: "pointer",
                  }}
                >
                  {currentValue}{" "}
                </option>
              ))}
            </select>
          </span>
        </Col>
      </Row>

      <Row>
        <Col style={{ overflowX: "scroll" }}>
          {earningsData &&
          earningsData.length &&
          revenueData &&
          revenueData.length &&
          expensesData &&
          expensesData.length ? (
            <LineGraph
              data={[
                {
                  id: "Earnings",
                  color: "hsl(235, 70%, 50%)",
                  data: earningsData,
                },
                {
                  id: "Revenue",
                  color: "hsl(235, 70%, 50%)",
                  data: revenueData,
                },
                {
                  id: "Expenses",
                  color: "hsl(68, 70%, 50%)",
                  data: expensesData,
                },
              ]}
              yAxis={"Transaction amount (INR)"}
              title={"Finance Year wise Graph"}
            />
          ) : null}
        </Col>
      </Row>
    </>
  );
}

export default FinanceGraph;
