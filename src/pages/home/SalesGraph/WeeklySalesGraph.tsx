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
      const currentDay = moment().subtract(weekDay, "days");
      const sales = flattenClientsData.filter(
        (currentValue) =>
          moment(currentValue.accepted_date).format("DD/MM/YY") ===
          currentDay.format("DD/MM/YY")
      );
      // console.log(sales);
      // console.log(flattenClientsData.filter(
      //   (currentValue) =>
      //     moment.utc(currentValue.accepted_date).format("DD/MM/YY") ===
      //     currentDay.format("DD/MM/YY")
      // ))
      // console.log()
      const initialValue = 0;
      arr[weekDay] = {
        x: `${currentDay.format("ddd,")} ${moment()
          .subtract(weekDay, "days")
          .format("DD/MMM")}`,
        y: 
        // flattenClientsData
          // .filter(
          //   (currentValue) =>
          //     moment(currentValue.accepted_date).format("DD/MM/YY") ===
          //     currentDay.format("DD/MM/YY")
          // )
          sales
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.PackageMRP,
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
      title={"Sales Weekly Graph"}
    />
  );
}

export default WeeklySalesGraph;
