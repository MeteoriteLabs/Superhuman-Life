import { useContext, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS_GRAPH,
  GET_EXPENSES_TRANSACTIONS_GRAPH,
} from "./Queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";

function FinanceGraph() {
  const [financeData, setFinanceData] = useState<any>([]);
  const auth = useContext(AuthContext);

  // eslint-disable-next-line
  const { data: get_earnings } = useQuery(
    GET_EARNINGS_TRANSACTIONS_GRAPH,
    {
      variables: {
        receiverId: auth.userid,
        receiverType: "Changemaker",
        transactionStatus: "Success",
        startDateTime: moment().subtract(1, "years").format(),
        endDateTime: moment().format(),
      },
      onCompleted: () => {
        getExpenses({
          variables: {
            senderId: auth.userid,
            senderType: "Changemaker",
            transactionStatus: "Success",
            startDateTime: moment().subtract(1, "years").format(),
            endDateTime: moment().format(),
          },
        });
      },
    }
  );

  const [
    getExpenses,
    {
      // eslint-disable-next-line
      data: get_expenses_transaction,
    },
  ] = useLazyQuery(GET_EXPENSES_TRANSACTIONS_GRAPH, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenEarningsTransactionsData = flattenObj({
      ...get_earnings?.transactions,
    });

    const flattenExpensesTransactionsData = flattenObj({
      ...data.transactions,
    });

    const earningsArray: any[] = [];
    const revenueArray: any[] = [];
    const expensesArray: any[] = [];

    const initialEarningsValue = 0;
    const initialRevenueValue = 0;
    const initialExpensesValue = 0;

    for (let month = 0; month < 12; month++) {
      let currentMonth = moment().subtract(month, "months");
      earningsArray[month] = {
        x: `${currentMonth.format("MMM YY")}`,
        y: flattenEarningsTransactionsData && flattenEarningsTransactionsData.length && flattenEarningsTransactionsData
          .filter(
            (currentValue) =>
              moment(currentValue.TransactionDateTime).format("MM/YY") ===
              currentMonth.format("MM/YY")
          )
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.ChangemakerAmount,
            initialEarningsValue
          ),
      };

      revenueArray[month] = {
        x: `${currentMonth.format("MMM YY")}`,
        y: flattenEarningsTransactionsData && flattenEarningsTransactionsData.length && flattenEarningsTransactionsData
          .filter(
            (currentValue) =>
              moment(currentValue.TransactionDateTime).format("MM/YY") ===
              currentMonth.format("MM/YY")
          )
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.TransactionAmount,
            initialRevenueValue
          ),
      };

      expensesArray[month] = {
        x: `${currentMonth.format("MMM YY")}`,
        y: flattenExpensesTransactionsData && flattenExpensesTransactionsData.length && flattenExpensesTransactionsData
          .filter(
            (currentValue) =>
              moment(currentValue.TransactionDateTime).format("MM/YY") ===
              currentMonth.format("MM/YY")
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
        data: earningsArray.reverse(),
      },
      {
        id: "Revenue",
        color: "hsl(235, 70%, 50%)",
        data: revenueArray.reverse(),
      },
      {
        id: "Expenses",
        color: "hsl(68, 70%, 50%)",
        data: expensesArray.reverse(),
      },
    ]);
  };
  return (
    <LineGraph
      data={financeData}
      yAxis={"Transaction amount (INR)"}
      title={"Finance Monthly Graph"}
    />
  );
}

export default FinanceGraph;
