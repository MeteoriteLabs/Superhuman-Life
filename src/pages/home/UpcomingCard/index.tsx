import { useContext, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_SESSIONS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
// import moment from "moment";
import "../LeadCard/lead.css";

function UpcomingCard() {
  const [leadData, setLeadData] = useState<any>([]);
  const auth = useContext(AuthContext);

  // function getDate(currDate: any) {
  //   let dateObj = new Date(currDate);
  //   let month = dateObj.getMonth() + 1;
  //   let year = dateObj.getFullYear();
  //   let date = dateObj.getDate();

  //   return `${year}-${month}-${date}`;
  // }
  // var now = moment().format('MMM DD h:mm A');
  // var date = moment().set({"hour": 0, "minute": 0});
  // alert(date);

  //session_date:{eq: $date},
  useQuery(GET_SESSIONS, {
    // variables: { id: Number(auth.userid) ,date: getDate(new Date())},
    variables: { id: Number(auth.userid) },
    onCompleted: (data) => {
      const flattenLeadsData = flattenObj({ ...data.sessions });
      setLeadData(flattenLeadsData);
    },
  });

  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
        Upcoming
      </Card.Header>
      <div className="scrollBar">
        <Card.Body>
          {leadData && leadData.length
            ? leadData.map((currentValue) => {
                return (
                  <Card
                    key={currentValue.id}
                    className="mt-2 bg-white rounded shadow"
                  >
                    {/* Offering name */}
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>
                            {currentValue.type === "workout"
                              ? currentValue.workout &&
                                currentValue.workout.workouttitle
                              : currentValue.activity &&
                                currentValue.activity.title}
                          </Card.Title>
                        </Col>
                      </Row>

                      {/* type and start time */}
                      <Card.Text>
                        Type: {currentValue.type ? currentValue.type : null}
                        <br />
                        Starts:{" "}
                        {currentValue.start_time
                          ? currentValue.start_time
                          : null}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                );
              })
            : null}
        </Card.Body>
      </div>
    </Card>
  );
}

export default UpcomingCard;
