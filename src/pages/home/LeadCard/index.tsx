import { useContext, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_SEEN_NEW } from "../../../builders/client-builder/leads/queries";
import { GET_LEADS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import "./lead.css";

function LeadComponent() {
  const [leadData, setLeadData] = useState<any>([]);
  const auth = useContext(AuthContext);

  useQuery(GET_LEADS, {
    variables: { id: Number(auth.userid) },
    onCompleted: (data) => {
      const flattenLeadsData = flattenObj({ ...data.websiteContactForms });
      setLeadData(flattenLeadsData);
    },
  });

  const [updateSeenStatus] = useMutation(UPDATE_SEEN_NEW, {
    refetchQueries: [GET_LEADS],
  });

  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
        Lead
      </Card.Header>
      <div className="scrollBar">
        <Card.Body>
          {leadData && leadData.length
            ? leadData.map((currentValue) => {
                return (
                  <Card
                    style={{cursor: "pointer"}}
                    key={currentValue.id}
                    className="mt-2 bg-white rounded shadow"
                    onClick={() => {
                      updateSeenStatus({
                        variables: {
                          seen: true,
                          id: currentValue.id,
                        },
                      });
                    
                    }}
                  >
                    {/* Lead name with mail and call option */}
                    <Card.Body>
                      <Row>
                        <Col md={{ span: 3, offset: 9 }}>
                          <a
                            href={`mailto:${
                              currentValue.Details 
                                ? currentValue.Details.leadsdetails.email
                                : null
                            }`}
                            className="text-dark"
                          >
                            <img
                              src="assets/home_page_images/mail.svg"
                              alt="mail"
                            />
                          </a>{" "}
                          <a
                            href={`tel:${
                              currentValue.Details
                                ? currentValue.Details.leadsdetails.phonenumber
                                : null
                            }`}
                            className="text-dark"
                          >
                            <img
                              src="assets/home_page_images/call.svg"
                              alt="call"
                            />
                          </a>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Card.Title>
                            {currentValue.Details
                              ? currentValue.Details.leadsdetails.name
                              : null}
                          </Card.Title>
                        </Col>
                      </Row>

                      {/* Message */}
                      <Card.Subtitle className="mb-2 text-secondary">
                        {currentValue.Details
                          ? currentValue.Details.leadsdetails.leadsmesssage
                          : null}
                      </Card.Subtitle>

                      <Card.Text>
                        Source:{" "}
                        {currentValue.Details
                          ? currentValue.Details.source
                          : null}
                        <br />
                        Status:{" "}
                        {currentValue.Details
                          ? currentValue.Details.status
                          : null}
                      </Card.Text>

                      <Card.Text>
                        Updated At:{" "}
                        {currentValue
                          ? moment(currentValue.updatedAt).format(
                              "MMMM DD,YYYY"
                            )
                          : null}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                );
              })
            : <p className="text-center">No leads to show</p>}
        </Card.Body>
      </div>
    </Card>
  );
}

export default LeadComponent;
