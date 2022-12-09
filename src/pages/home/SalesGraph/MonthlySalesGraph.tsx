import { useContext, useState } from "react";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";

function MonthlySalesGraph() {
  const [clientsData, setClientsData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_CLIENTS, {
    variables: {
      id: Number(auth.userid),
      startDateTime: moment().subtract(1, "years").format(),
      endDateTime: moment().format()
    },
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenClientsData = flattenObj({ ...data.clientPackages });

    const arr: any[] = [];

    for (let month = 0; month < 12; month++) {
      const sales = flattenClientsData.filter(
        (currentValue) =>
          moment(currentValue.accepted_date).format("MM/YY") ===
          moment().subtract(month, "months").format("MM/YY")
      );
      const initialValue = 0;
      arr[month] = {
        x: `${moment().subtract(month, "months").format("MMM YY")}`,
        y: sales.reduce(
          (acc, currentValue) => acc + currentValue.PackageMRP,
          initialValue
        ),
      };
    }

    setClientsData([
      { id: "Sales", color: "hsl(241, 100%, 0%)", data: arr.reverse() },
    ]);
  };

  return (
    <LineGraph
      data={clientsData}
      yAxis={"Sales (INR)"}
      title={"Sales Monthly Graph"}
    />
  );
}

export default MonthlySalesGraph;
