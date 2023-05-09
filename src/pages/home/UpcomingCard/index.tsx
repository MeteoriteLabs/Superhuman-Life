import { useContext, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_SESSIONS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import '../LeadCard/lead.css';
import NoDataInCard from '../../../components/NoDataInCard';

function UpcomingCard() {
  const [sessionData, setSessionData] = useState<any>([]);
  const auth = useContext(AuthContext);
  const currentDate = new Date();

  function getDate(time: Date): string {
    const dateObj: Date = new Date(time);
    const month: number | string =
      dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    const year: number = dateObj.getFullYear();
    const date: number | string =
      dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();

    return `${year}-${month}-${date}`;
  }

  useQuery(GET_SESSIONS, {
    variables: { id: Number(auth.userid), session_date: getDate(currentDate) },
    pollInterval: 900000, //fetches data every 15 mins
    onCompleted: (data) => {
      const currentTime = new Date();
      const flattenLeadsData = flattenObj({ ...data.sessions });
      
      const nextUpcomingSessions = flattenLeadsData.filter((currentValue) => {
        const [hours, minutes] = currentValue.start_time.split(':');
        
        const date = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          +hours,
          +minutes,
          0
        );

        return date >= currentTime;
      });
      setSessionData(nextUpcomingSessions);
    }
  });

  function getStartTime(startTime: string): string {
    const splitTime: string[] = startTime.split(':');
    const date: moment.Moment = moment().set({
      hour: Number(splitTime[0]),
      minute: Number(splitTime[1])
    });
    const time: string = moment(date).format('h:mm A');
    return time;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
        Upcoming
      </Card.Header>
      <div className="scrollBar">
        <Card.Body>
          {sessionData && sessionData.length ? (
            <Card key={sessionData[0].id} className="mt-2 bg-white rounded shadow">
              {/* Offering name */}
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>
                      {sessionData[0].type === 'workout'
                        ? sessionData[0].workout && sessionData[0].workout.workouttitle
                        : sessionData[0].activity && sessionData[0].activity.title}
                    </Card.Title>
                  </Col>
                </Row>

                {/* type and start time */}
                <Card.Text>
                  Type: {sessionData[0].type ? sessionData[0].type : null}
                  <br />
                  Starts:{' '}
                  {sessionData[0].start_time ? getStartTime(sessionData[0].start_time) : null}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <NoDataInCard msg={'No upcoming cards to show'} />
          )}
        </Card.Body>
      </div>
    </Card>
  );
}

export default UpcomingCard;
