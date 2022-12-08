import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOKINGS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";

function MonthlyOfferingBookingGraph() {
  const [clientsData, setClientsData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_BOOKINGS, {
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
    const flattenClientsData = flattenObj({ ...data.clientBookings });

    const arr: any[] = [];

    for (let month = 0; month < 12; month++) {
      arr[month] = {
        x: `${moment().subtract(month, "months").format("MMM YY")}`,
        y: flattenClientsData.filter(
          (currentValue) =>
            moment(currentValue.booking_date).format("MM/YY") ===
            moment().subtract(month, "months").format("MM/YY")
        ).length,
      };
    }

    setClientsData([
      { id: "Clients", color: "hsl(241, 100%, 0%)", data: arr.reverse() },
    ]);
  };

  return (
    <LineGraph
      data={clientsData}
      yAxis={"No. of Bookings"}
      title={"Bookings Monthly Graph"}
    />
  );
}

export default MonthlyOfferingBookingGraph;
