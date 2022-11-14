import { useContext, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_SESSIONS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import "../LeadCard/lead.css";

function UpcomingCard() {
  const [sessionData, setSessionData] = useState<any>([]);
  const auth = useContext(AuthContext);
  const currentDate = new Date();

  function getDate(time: Date): string {
    let dateObj: Date = new Date(time);
    let month: number = dateObj.getMonth() + 1;
    let year: number = dateObj.getFullYear();
    let date: number = dateObj.getDate();

    return `${year}-${month}-${date}`;
  }

  function getCurrentTime(): string {
    let dateObj: Date = new Date();
    let hours: number = dateObj.getHours();
    let mins: number = dateObj.getMinutes();

    return `${hours}:${mins}`;
  }

  function getNextOneHourTime(): string {
    let dateObj: Date = new Date();
    let hours: number = dateObj.getHours() + 1;
    let mins: number = dateObj.getMinutes();

    return `${hours}:${mins}`;
  }
  
  useQuery(GET_SESSIONS, {
    variables: { id: Number(auth.userid), session_date: getDate(currentDate) },
    pollInterval: 900000, //fetches data every 15 mins
    onCompleted: (data) => {
      const flattenLeadsData = flattenObj({ ...data.sessions });
      const sessionsLessThanNextOneHour = flattenLeadsData.filter(
        (currentValue) =>

          // currentValue.start_time >= getCurrentTime() 
          // &&
          currentValue.start_time <= getNextOneHourTime()
      );
      console.log(sessionsLessThanNextOneHour);
      setSessionData(sessionsLessThanNextOneHour);
    },
  });

  function getStartTime(startTime: string): string {
    let splitTime: string[] = startTime.split(":");
    let date: moment.Moment = moment().set({
      hour: Number(splitTime[0]),
      minute: Number(splitTime[1]),
    });
    let time: string = moment(date).format("h:mm A");
    return time;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
        Upcoming
      </Card.Header>
      <div className="scrollBar">
        <Card.Body>
          {sessionData && sessionData.length
            ? sessionData.map((currentValue) => {
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
                          ? getStartTime(currentValue.start_time)
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
