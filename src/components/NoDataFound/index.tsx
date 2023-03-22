import { Row, Col } from "react-bootstrap";

function NoDataFound({msg}) {
  return (
    <Row className="row">
      <Col lg={12}>
        <img
          src="assets/empty_data.svg"
          alt="no data"
          width="90%"
          height="70%"
          className="ml-4"
        />
        <h4 className="text-center pt-3">{msg}</h4>
      </Col>
    </Row>
  );
}

export default NoDataFound;
