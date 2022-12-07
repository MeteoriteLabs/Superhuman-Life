import { useContext, useState } from "react";
import BarGraph from "../../../components/Graphs/BarGraph/BarGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";

function MonthlyClientGraph() {
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

    for (let month = 0; month < 12; month++) {
      arr[month] = {
        index: `${moment().subtract(month, "months").format("MMM/YY")}`,
        keys: flattenClientsData.filter(
          (currentValue) =>
            moment(currentValue.accepted_date).format("MM/YY") ===
            moment().subtract(month, "months").format("MM/YY")
        ).length,
      };
    }

    setClientsData(arr.reverse());
  };

  return (
    <BarGraph
      data={clientsData}
      yAxis={"No. of Clients"}
      title={"Clients Monthly Graph"}
    />
  );
}

export default MonthlyClientGraph;
