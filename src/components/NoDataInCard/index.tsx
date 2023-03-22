import {Col, Row} from "react-bootstrap";

function NoDataInCard({msg}) {
  return (
    <Row className="row">
    <Col lg={12} className="text-center mt-5">
      <img
        src="assets/empty_result.svg"
        alt="no data"
        width="35%"
        height="40%"
      />
      <h6 className="text-center pt-3">{msg}</h6>
    </Col>
  </Row>
  )
}

export default NoDataInCard;
