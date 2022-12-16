import { useContext, useState } from "react";
import LineGraph from "../../../components/Graphs/LineGraph/LineGraph";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

function MonthlySalesGraph() {
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
    const initialValue = 0;

    for (let month = 0; month < 12; month++) {
      let currentMonth = moment().subtract(month, "months");

      let sales = flattenClientsData.filter(
        (currentValue) =>
          moment(currentValue.accepted_date).format("MM/YY") ===
          currentMonth.format("MM/YY")
      );

      arr[month] = {
        x: `${currentMonth.format("MMM YY")}`,
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
    <Row>
      <Col style={{ overflowX: "scroll" }}>
        <LineGraph
          data={clientsData}
          yAxis={"Sales (INR)"}
        />
      </Col>
    </Row>
  );
}

export default MonthlySalesGraph;
