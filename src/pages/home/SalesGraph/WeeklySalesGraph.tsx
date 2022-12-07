import { useContext, useState } from "react";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";

function WeeklySalesGraph() {
  const [clientsData, setClientsData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_CLIENTS, {
    variables: { id: Number(auth.userid) },
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenClientsData = flattenObj({ ...data.clientPackages });

    const arr: any[] = [];

    for (let weekDay = 0; weekDay < 7; weekDay++) {
      const sales = flattenClientsData.filter(
        (currentValue) =>
          moment(currentValue.accepted_date).format("MM/YY") ===
          moment().subtract(weekDay, "days").format("MM/YY")
      );
      const initialValue = 0;
      arr[weekDay] = {
        x: `${moment().subtract(weekDay, "days").format("ddd,")}`,
        y: sales.reduce(
          (accumulator, currentValue) => accumulator + currentValue.PackageMRP,
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
      yAxis={"Sales"}
      title={"Sales Weekly Graph"}
    />
  );
}

export default WeeklySalesGraph;
