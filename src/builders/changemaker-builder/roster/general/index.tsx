import { Row, Col } from "react-bootstrap";

const RosterGeneral = (props: any) => {
  const data = props?.data[0]?.session;

  return (
    <>
      <div
        className="text-right shadow-lg p-4"
        style={{ borderRadius: "15px" }}
      >
        <span>
          <b>Edit</b>
        </span>
        <img src="/assets/edit.svg" alt="edit_icon" className="pl-4" />
        <hr />
        <Row>
          <Col className="text-left">
            <div className="mb-3">
              <h5>About</h5>
              <div
                className="p-4"
                style={{ border: "1px solid black", borderRadius: "20px" }}
              >
                <span>{data?.workout?.About}</span>
              </div>
            </div>
            <div className="mb-3">
              <h5>Benefits</h5>
              <div
                className="p-4"
                style={{ border: "1px solid black", borderRadius: "20px" }}
              >
                <span>{data?.workout?.Benifits}</span>
              </div>
            </div>
            <div className="mb-3">
              <h5>Equipment</h5>
              <div
                className="p-4"
                style={{ border: "1px solid black", borderRadius: "20px" }}
              >
                <span>
                  {data?.workout?.equipment_lists
                    ?.map((item: any) => {
                      return item.name;
                    })
                    .join(", ")}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <h5>Muscle Group</h5>
              <div
                className="p-4"
                style={{ border: "1px solid black", borderRadius: "20px" }}
              >
                <span>
                  {data?.workout?.muscle_groups
                    ?.map((item: any) => {
                      return item.name;
                    })
                    .join(", ")}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RosterGeneral;
