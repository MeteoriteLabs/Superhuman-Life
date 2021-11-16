import { useState, useRef, useContext } from "react";
import {
  Tabs,
  Tab,
  Row,
  Col,
  Card,
  Button,
  Image,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import "./Tabs.css";
import SetUpDomain from "../Domain/SetUpDomain";
import { useQuery } from "@apollo/client";
import WebsiteModalComponent from "../templateModal/TemplateModal";
import DomainHelpModalComponent from "../Domain";
import { templateData } from "./TemplateData";
import CreateWebpageDetails from "../../webpage-details/createoredit-webpage";
import {
  FETCH_WEBSITE_DATA,
  FETCH_WEBSITE_SCHEMA_AND_FORM_JSON,
} from "../../webpage-details/queries";
import AuthContext from "../../../context/auth-context";

export default function TabsComponent() {
  const [key, setKey] = useState("professional");
  const auth = useContext(AuthContext);
  const createWebpageDetailsComponent = useRef<any>(null);

  const [websiteData, setWebsiteData] = useState<any>({});
  const [btnStatus, setBtnStatus] = useState<boolean>(false);
  const [formSwitch, setFormSwitch] = useState<boolean>(true);

  useQuery(FETCH_WEBSITE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      setWebsiteData(r.websiteData[0]);
    },
  });

  useQuery(FETCH_WEBSITE_SCHEMA_AND_FORM_JSON, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      if (r.websiteData[0] === undefined) {
        setBtnStatus(true);
        setFormSwitch(false);
      }
    },
  });

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k: any) => setKey(k)}
        className="mb-3 d-flex justify-content-center"
      >
        <Tab eventKey="professional" title="Professional">
          <Row className="bg-dark">
            <Col
              className=" text-light d-flex align-items-center justify-content-center"
              md={{ span: 2, offset: 5 }}
              xs={{ span: 6, offset: 0 }}
            >
              <h3 className="mt-1">Domain</h3>
            </Col>
            <Col
              md={{ span: 1, offset: 4 }}
              xs={{ span: 6, offset: 0 }}
              className="d-flex justify-content-end"
            >
              <DomainHelpModalComponent />
            </Col>
          </Row>

          {/* cards section */}
          <Row>
            <Col className="p-0" md={{ span: 4, offset: 2 }} xs={12}>
              <Col className="py-3 p-0 ">
                <Card className="border border-dark p-0 mt-2 ">
                  <Card.Header
                    as="h6"
                    className="  d-flex justify-content-center text-light bg-dark p-2"
                  >
                    Custom Domain
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    <Card.Text>
                      {" "}
                      {websiteData != null ? (
                        <p> www.dummy.com</p>
                      ) : (
                        <p>.........................</p>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Col>

            <Col className="p-0" md={{ span: 4, offset: 0 }} xs={12}>
              <Col className=" py-3 p-0">
                <Card className="border border-dark mt-2">
                  <Card.Header as="h6" className="m-0 bg-dark p-0">
                    <Row>
                      <Col
                        className="d-flex justify-content-center align-items-center text-light"
                        md={{ span: 4, offset: 4 }}
                        xs={{ span: 6, offset: 1 }}
                      >
                        Sapien Domain
                      </Col>
                      <Col
                        className=" d-flex justify-content-end text-light "
                        md={{ span: 3, offset: 1 }}
                        xs={{ span: 4, offset: 1 }}
                      >
                        <DomainPopover />
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    <Card.Text>
                      {" "}
                      {websiteData != null ? (
                        <p> Www.dummy.sapienlife.com</p>
                      ) : (
                        <p>..............................</p>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Col>
          </Row>

          <Row>
            <Col
              className="text-center text-light bg-dark"
              md={{ span: 12, offset: 0 }}
            >
              <h3>Website</h3>
            </Col>
          </Row>

          <Row className="p-4">
            <Col
              className="mt-2 d-flex justify-content-center"
              md={{ span: 2, offset: 3 }}
            >
              <Button
                variant="light"
                className=" shadow bg-white rounded border-dark text-dark px-5 py-1"
              >
                <h6>Preview</h6>
              </Button>
            </Col>
            <Col
              md={{ span: 2, offset: 1 }}
              className="mt-2 d-flex justify-content-center"
            >
              <Button
                variant="light"
                className="shadow  bg-white rounded border-dark"
              >
                <Form>
                  <div className="d-flex ">
                    <h6 className="pr-2">Inactive</h6>
                    <Form.Switch checked={formSwitch} id="custom-switch" />
                    <h6>Active</h6>
                  </div>
                </Form>
              </Button>
            </Col>
          </Row>

          <Row>
            <Col className="p-0" xs={12} md={{ span: 10, offset: 1 }}>
              <Card className="border border-dark">
                <Card.Header className=" bg-dark">
                  <Row xs={2} md={2}>
                    <Col
                      md={{ span: 2, offset: 0 }}
                      xs={{ span: 5, offset: 0 }}
                      className="text-light p-0 d-flex align-items-center"
                    >
                      Template
                    </Col>
                    <Col
                      md={{ span: 2, offset: 8 }}
                      xs={{ span: 7, offset: 0 }}
                      className="d-flex justify-content-end text-light p-0"
                    >
                      <WebsiteModalComponent />
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <Row md={1} xs={1}>
                    <Col className="d-flex justify-content-center">
                      {websiteData != null ? (
                        <Image fluid src="assets/website_images/template.svg" />
                      ) : (
                        <>
                          <Image fluid src="assets/website_images/black.svg" />
                          <div className="template-btn">
                            <WebsiteModalComponent />
                          </div>
                        </>
                      )}
                    </Col>
                    <Col className="d-flex justify-content-center mt-3">
                      {websiteData != null ? <p>Template Name</p> : ""}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col className="p-0" md={{ span: 10, offset: 1 }}>
              <Card className="border border-dark">
                <Card.Header className="m-0 bg-dark">
                  <Row>
                    <Col
                      md={{ span: 2, offset: 0 }}
                      xs={{ span: 6, offset: 0 }}
                      className="text-light p-0 d-flex align-items-center"
                    >
                      Details
                    </Col>
                    <Col
                      md={{ span: 2, offset: 8 }}
                      xs={{ span: 6, offset: 0 }}
                      className="d-flex justify-content-end text-light p-0"
                    >
                      <div>
                        <Button
                          variant="dark"
                          className="px-5 border"
                          onClick={() => {
                            createWebpageDetailsComponent.current.TriggerForm({
                              id: null,
                              type: "edit",
                            });
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {websiteData != null ? (
                    <>
                      <Row>
                        <Col md={{ span: 4, offset: 3 }}>
                          {templateData.map((data) => (
                            <div key={data.id} className="d-flex p-2 gap-4">
                              <Image fluid src={data.image} />
                              <h6 className="d-flex align-items-center px-3">
                                {data.label}
                              </h6>
                            </div>
                          ))}
                        </Col>
                        <Col md={{ span: 4, offset: 0 }}>
                          {templateData.map((data) => (
                            <div key={data.id} className="d-flex p-2 gap-4">
                              <Image fluid src={data.image} />
                              <h6 className="d-flex align-items-center px-3">
                                {data.label}
                              </h6>
                            </div>
                          ))}
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          md={{ span: 3, offset: 9 }}
                          className="p-0 d-flex justify-content-end"
                        >
                          <span> Last updated: 20 June 2021</span>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col className="d-flex justify-content-center p-5 m-4">
                        <div>
                          <h1>No Template Selected</h1>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="profile" title="Organization">
          Organization details
        </Tab>
        <Tab eventKey="contact" title="Custom">
          Custom details
        </Tab>
      </Tabs>
      <CreateWebpageDetails
        ref={createWebpageDetailsComponent}
      ></CreateWebpageDetails>
    </>
  );
}

const popover = (
  <Popover id="popover-basic">
    <Popover.Content className="p-3">
      <SetUpDomain />
    </Popover.Content>
  </Popover>
);

const DomainPopover = () => (
  <OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
    <Button variant="dark" className="p-1">
      <span>&#8942;</span>
    </Button>
  </OverlayTrigger>
);
