import { useState, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { FETCH_USER_INDUSTRY } from 'builders/package-builder/fitness/graphQL/queries';
import { flattenObj } from 'components/utils/responseFlatten';
import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';
import Movement from './Movement/Movement';
import Sessions from './Sessions';
import './booking.css';

export default function BookingPage(): JSX.Element {
    const [industryData, setIndustryData] = useState<any[]>([]);
    const auth = useContext(AuthContext);

    useQuery(FETCH_USER_INDUSTRY, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setIndustryData(flattenData.usersPermissionsUser.industries);
        }
    });
    // const history = useHistory();

    // const routeChange = () => {
    //   const path = `/bookingSettings`;
    //   history.push(path);
    // };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h2>All Bookings</h2>
                {/* <div className="px-5">
          <Button onClick={routeChange} variant="outline-dark">
            Settings
          </Button>
        </div> */}
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs
                        className="pb-3"
                        variant="pills"
                        transition={false}
                        key={
                            industryData && industryData.length ? industryData[0].IndustryName : ''
                        }
                        defaultActiveKey={
                            industryData && industryData.length ? industryData[0].IndustryName : ''
                        }
                    >
                        {industryData && industryData.length
                            ? industryData.map((curr) => (
                                  <Tab
                                      eventKey={curr.IndustryName}
                                      title={curr.IndustryName}
                                      key={curr.IndustryName}
                                      className="cards"
                                  >
                                      <Tabs
                                          defaultActiveKey="offerings"
                                          variant="pills"
                                          transition={false}
                                      >
                                          <Tab eventKey="offerings" title="Offerings">
                                              <Movement industry={curr} />
                                          </Tab>
                                          <Tab eventKey="sessions" title="Sessions">
                                              <Sessions />
                                          </Tab>
                                      </Tabs>
                                  </Tab>
                              ))
                            : null}
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}
