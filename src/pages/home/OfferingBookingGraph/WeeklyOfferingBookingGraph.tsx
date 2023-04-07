import { useContext, useState } from "react";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { useQuery } from "@apollo/client";
import { GET_BOOKINGS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import { Col, Row } from "react-bootstrap";

function WeeklyOfferingBookingGraph() {
  const [clientsData, setClientsData] = useState<Record<string, unknown>[]>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_BOOKINGS, {
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
    const flattenClientsData = flattenObj({ ...data.clientBookings });

    const arr: Record<string, unknown>[] = [];

    for (let weekDay = 0; weekDay < 7; weekDay++) {
      const currentDay = moment().subtract(weekDay, "days");
      arr[weekDay] = {
        x: `${currentDay.format("ddd,")} ${moment()
          .subtract(weekDay, "days")
          .format("DD/MMM")}`,
        y: flattenClientsData.filter(
          (currentValue) =>
            moment.utc(currentValue.booking_date).format("DD/MM/YY") ===
            currentDay.format("DD/MM/YY")
        ).length,
      };
    }

    setClientsData([
      { id: "Bookings", color: "hsl(241, 100%, 0%)", data: arr.reverse() },
    ]);
  };

  return (
    <Row>
      <Col style={{ overflowX: "auto" }}>
        <LineGraph
          data={clientsData}
          yAxis={"Offering Bookings"}
        />
      </Col>
    </Row>
  );
}

export default WeeklyOfferingBookingGraph;
