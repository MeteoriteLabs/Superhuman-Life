import { useState, useContext, useRef } from "react";
import "./templateModal.css";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col, Button, Modal, Image } from "react-bootstrap";
import { PaginationBasic } from "./PaginationModal";
import {
  FETCH_PUBLISHED_TEMPLATES,
  FETCH_WEBSITE_DATA,
  UPDATE_WEBSITE_DATA_TO_EMPTY,
} from "../../webpage-details/queries";
import CreateWebpageDetails from "../../webpage-details/createoredit-webpage";

import AuthContext from "../../../context/auth-context";

function ModalComp(props) {
  const [showTemplate, setShowTemplate] = useState<any>([]);
  const [templateId, setTemplateId] = useState<any>(null);
  const [websiteDataRecordId, setWebsiteDataRecordId] = useState<any>();
  const [currentTemplateId, setCurrentTemplateId] = useState<any>();

  const auth = useContext(AuthContext);

  const passTemplateId = useRef<any>(null);

  useQuery(FETCH_PUBLISHED_TEMPLATES, {
    onCompleted: (data: any) => {
      setShowTemplate(data.websiteTemplates);
    },
  });

  const { setReceivedData, setModalShow, setCount } = props;

  setReceivedData(templateId);

  useQuery(FETCH_WEBSITE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      console.log("I am templateModal");
      console.log(r);
      if (r.websiteData[0] !== undefined) {
        setWebsiteDataRecordId(r.websiteData[0].id);
        setCurrentTemplateId(r.websiteData[0].website_template.id);
      } else {
        return;
      }
    },
  });

  const [updateDetails] = useMutation(UPDATE_WEBSITE_DATA_TO_EMPTY, {
    variables: {
      record_id: websiteDataRecordId,
      user: auth.userid,
      form_data: {},
    },

    onCompleted: (r: any) => {
      setCount(templateId);
    },
    refetchQueries: [
      { query: FETCH_WEBSITE_DATA, variables: { id: auth.userid } },
    ],
  });

  const triggerUpdateDetailsMutation = () => {
    if (currentTemplateId !== templateId && websiteDataRecordId) {
      updateDetails();
    } else {
      return;
    }
  };

  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
      >
        <Modal.Header className="d-flex justify-content-center p-0 bg-dark">
          <Modal.Title
            as="h2"
            id="contained-modal-title-vcenter"
            className=" fw-bold text-white "
          >
            Web Template
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container className="p-2">
            {/* start of filter button */}
            <Row>
              <Col className="d-flex justify-content-center p-3">
                <Button variant="outline-success" className="px-5 rounded-pill">
                  Filter
                </Button>
              </Col>
            </Row>
            {/* end of filter button */}

            <Row className="p-0">
              {showTemplate.map((data) => (
                <Col
                  onClick={() => {
                    setTemplateId(data.id);
                    triggerUpdateDetailsMutation();
                  }}
                  key={data.id}
                  className={`p-3 m-0 hover-effect ${
                    templateId === data.id ? "active_template" : ""
                  }`}
                  md={{ span: 4, offset: 0 }}
                >
                  <Image fluid src="assets/website_images/template.svg" />
                  <div className="button-wrapper">
                    <Button className="border rounded">Preview</Button>
                  </div>
                  <Col className="d-flex justify-content-center mt-3">
                    <h5>{data.template_name}</h5>
                  </Col>
                </Col>
              ))}
            </Row>

            <Row className="mt-2">
              <Col
                className="d-flex justify-content-around"
                md={{ span: 4, offset: 4 }}
              >
                <PaginationBasic />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col className="p-0" md={{ span: 4, offset: 4 }}>
                <span>Don't like the template?</span> <br />
                <span>Contact us for customized website </span>
              </Col>
              <Col md={{ span: 3, offset: 1 }} className="px-1 ">
                <Button
                  variant="success"
                  className="m-0"
                  onClick={() => {
                    setModalShow(false);
                  }}
                >
                  Select Template
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <CreateWebpageDetails ref={passTemplateId}></CreateWebpageDetails>
    </>
  );
}

export default function WebsiteModalComponent({
  setTemplateId,
  setNewTemplateId,
}) {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<any>();
  const [changeInTemplateId, setChangeInTemplateId] = useState<any>();

  setTemplateId(receivedData);
  setNewTemplateId(changeInTemplateId);

  return (
    <>
      <Button
        className="px-2 border"
        variant="dark"
        onClick={() => setModalShow(true)}
      >
        Show Templates
      </Button>

      <ModalComp
        show={modalShow}
        onHide={() => setModalShow(false)}
        setReceivedData={setReceivedData}
        setModalShow={setModalShow}
        setCount={setChangeInTemplateId}
      />
    </>
  );
}
