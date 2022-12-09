import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS_GRAPH,
  GET_EXPENSES_TRANSACTIONS,
} from "./Queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";

function FinanceGraph() {
  const [financeData, setFinanceData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_EARNINGS_TRANSACTIONS_GRAPH, {
    variables: {
      receiverId: auth.userid,
      receiverType: "Changemaker",
      transactionStatus: "Success",
      startDateTime: moment().subtract(1, "years").format(),
      endDateTime: moment().format(),
    },
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenClientsData = flattenObj({ ...data.transactions });

    const earningsArray: any[] = [];
    const initialValue = 0;
    for (let month = 0; month < 12; month++) {
      let currentMonth = moment().subtract(month, "months");
      earningsArray[month] = {
        x: `${currentMonth.format("MMM YY")}`,
        y: flattenClientsData
          .filter(
            (currentValue) =>
              moment(currentValue.TransactionDateTime).format("MM/YY") ===
              currentMonth.format("MM/YY")
          )
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.ChangemakerAmount,
            initialValue
          ),
      };
    }

    setFinanceData([
      {
        id: "Earnings",
        color: "hsl(241, 100%, 0%)",
        data: earningsArray.reverse(),
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
