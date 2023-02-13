import { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

const BookingConfig = (props: any) => {
  const inputDisabled = props.uiSchema.readonly;
  const [fillSchedule, setFillSchedule] = useState(
    props.value !== undefined ? JSON.parse(props.value).fillSchedule : false
  );
  const [config, setConfig] = useState(
    props.value !== undefined ? JSON.parse(props.value).config : ""
  );

  function handleValidation() {
    if (config !== "" && config === "Manual") {
      return true;
    } else if (config !== "" && config === "Auto") {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (handleValidation()) {
      props.onChange(
        JSON.stringify({ fillSchedule: fillSchedule, config: config })
      );
    } else {
      props.onChange(undefined);
    }
    //eslint-disable-next-line
  }, [fillSchedule, config]);

  return (
    <>
      <div>
        <Form.Check
          inline
          label="Manual"
          value={"Manual"}
          disabled={inputDisabled}
          defaultChecked={config === "Manual" ? true : false}
          onClick={(e: any) => setConfig(e.target.value)}
          name="group1"
          type="radio"
          id={`inline-1`}
        />
        <Form.Check
          inline
          label="Auto"
          value={"Auto"}
          disabled={inputDisabled}
          defaultChecked={config === "Auto" ? true : false}
          onClick={(e: any) => setConfig(e.target.value)}
          name="group1"
          type="radio"
          id={`inline-2`}
        />
        <Form.Text className="text-muted">
          In auto it will automatically accept all bookings
        </Form.Text>
      </div>
      {config === "Auto" && (
        <div className="mb-3">
          <Col>
            <Row className="mt-3">
              <Col lg={2} className="pl-0">
                <span>Fill My Schedule</span>
              </Col>
              <Col lg={1}>
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    defaultChecked={fillSchedule}
                    onClick={() => setFillSchedule(!fillSchedule)}
                    disabled={inputDisabled}
                  />
                </Form>
              </Col>
            </Row>
          </Col>
          <span className="small text-muted">
            Fills your schedule based on your availability with this offering
          </span>
        </div>
      )}
    </>
  );
};

export default BookingConfig;
