import { useContext, useState } from "react";
import BarGraph from "../../../components/Graphs/BarGraph/BarGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

function WeeklyClientGraph(): JSX.Element {
  const [clientsData, setClientsData] = useState<{index: string; Clients: number;}[]>([]);
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

    const arr: {index: string; Clients: number;}[] = [];

    for (let weekDay = 0; weekDay < 7; weekDay++) {
      const currentDay = moment().subtract(weekDay, "days");
      arr[weekDay] = {
        index: `${currentDay.format("ddd,")} ${moment()
          .subtract(weekDay, "days")
          .format("DD/MMM")}`,
        Clients: flattenClientsData.filter(
          (currentValue) =>
            moment(currentValue.accepted_date).format("DD/MM/YYYY") ===
            currentDay.format("DD/MM/YYYY")
        ).length,
      };
    }

    setClientsData(arr.reverse());
  };

  return (
    <Row>
      <Col style={{ overflowX: "auto" }}>
        <BarGraph
          data={clientsData}
          yAxis={"No. of Clients"}
          keyName={["Clients"]}
        />
      </Col>
    </Row>
  );
}

export default WeeklyClientGraph;
