import { useContext, useState } from "react";
import BarGraph from "../../../components/Graphs/BarGraph/BarGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";

function WeeklyClientGraph() {
  const [clientsData, setClientsData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_CLIENTS, {
    variables: {
      id: Number(auth.userid),
      startDateTime: moment().subtract(1, "years").format(),
      endDateTime: moment().format(),
    },
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenClientsData = flattenObj({ ...data.clientPackages });

    const arr: any[] = [];

    for (let weekDay = 0; weekDay < 7; weekDay++) {
      arr[weekDay] = {
        index: `${moment().subtract(weekDay, "days").format("ddd,")} ${moment()
          .subtract(weekDay, "days")
          .format("DD/MMM")}`,
        Clients: flattenClientsData.filter(
          (currentValue) =>
            moment(currentValue.accepted_date).format("DD/MM/YYYY") ===
            moment().subtract(weekDay, "days").format("DD/MM/YYYY")
        ).length,
      };
    }

    setClientsData(arr.reverse());
  };

  return (
    <BarGraph
      data={clientsData}
      yAxis={"No. of Clients"}
      title={"Clients Weekly Graph"}
      keyName= {["Clients"]}
    />
  );
}

export default WeeklyClientGraph;
