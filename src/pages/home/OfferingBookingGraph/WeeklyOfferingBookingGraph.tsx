import { useContext, useState } from "react";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { useQuery } from "@apollo/client";
import { GET_BOOKINGS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";

function WeeklyOfferingBookingGraph() {
  const [clientsData, setClientsData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_BOOKINGS, {
    variables: { id: Number(auth.userid) },
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const loadData = (data) => {
    const flattenClientsData = flattenObj({ ...data.clientBookings });

    const arr: any[] = [];

    for (let weekDay = 0; weekDay < 7; weekDay++) {
      arr[weekDay] = {
        x: `${moment().subtract(weekDay, "days").format("ddd,")}`,
        y: flattenClientsData.filter(
          (currentValue) =>
            moment(currentValue.booking_date).format("MM/YY") ===
            moment().subtract(weekDay, "days").format("MM/YY")
        ).length,
      };
    }

    setClientsData([
      { id: "Bookings", color: "hsl(241, 100%, 0%)", data: arr.reverse() },
    ]);
  };

  return (
    <LineGraph
      data={clientsData}
      yAxis={"Offering Bookings"}
      title={"Bookings Weekly Graph"}
    />
  );
}

export default WeeklyOfferingBookingGraph;
