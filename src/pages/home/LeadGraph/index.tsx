import { useContext, useState } from "react";
import BarGraph from "../../../components/Graphs/BarGraph/BarGraph";
import { useQuery } from "@apollo/client";
import { GET_LEADS } from "./queries";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import { Tabs, Tab } from "react-bootstrap";
import WeeklyLeadsGraph from "./WeeklyLeadsGraph";

function LeadGraph() {
  const [leadsData, setLeadData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_LEADS, {
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
    const flattenLeadsData = flattenObj({ ...data.websiteContactForms });

    const arr: any[] = [];

    for (let month = 0; month < 12; month++) {
      arr[month] = {
        index: `${moment().subtract(month, "months").format("MMM YY")}`,
        Leads: flattenLeadsData.filter(
          (currentValue) =>
            moment(currentValue.createdAt).format("MM/YY") ===
            moment().subtract(month, "months").format("MM/YY")
        ).length,
      };
    }

    setLeadData(arr.reverse());
  };

  return (
    <>
      <Tabs defaultActiveKey="monthly" id="uncontrolled-tab-example">
        <Tab eventKey="monthly" title="Monthly">
          <BarGraph
            data={leadsData}
            yAxis={"No. of Leads"}
            title={"Leads Monthly Graph"}
            keyName= {["Leads"]}
          />
        </Tab>
        <Tab eventKey="weekly" title="Weekly">
          <WeeklyLeadsGraph />
        </Tab>
      </Tabs>
    </>
  );
}

export default LeadGraph;
