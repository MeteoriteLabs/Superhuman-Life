import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const BookingConfig: React.FC<{
  value: string;
  onChange: (args: string | null) => void;
  uiSchema: { 'ui:widget'?: string; classNames?: string; readonly?: boolean };
}> = (props) => {
  const inputDisabled: boolean | null = props.uiSchema.readonly ? props.uiSchema.readonly : null;

  const [fillSchedule, setFillSchedule] = useState<boolean>(
    props.value ? JSON.parse(props.value).fillSchedule : false
  );
  const [config, setConfig] = useState<string>(
    props.value ? JSON.parse(props.value).config : 'Manual'
  );
  const [bookings, setBookings] = useState<number>(
    props.value ? JSON.parse(props.value).bookings : 0
  );

  function handleValidation() {
    if (config !== '' && config === 'Manual') {
      return true;
    } else if (config !== 'Manual' && config === 'Auto' && bookings !== 0 && !fillSchedule) {
      return true;
    } else if (config === 'Auto' && fillSchedule) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (bookings > 12 || bookings < 0) {
      setBookings(12);
    }
    if (handleValidation()) {
      props.onChange(
        JSON.stringify({
          fillSchedule: fillSchedule,
          config: config,
          bookings: bookings
        })
      );
    } else {
      props.onChange(null);
    }
    //eslint-disable-next-line
  }, [fillSchedule, config, bookings]);

  return (
    <>
      <div>
        <Form.Check
          inline
          label="Manual"
          value={'Manual'}
          disabled={inputDisabled ? inputDisabled : false}
          defaultChecked={config === 'Manual' ? true : false}
          onClick={(e: any) => setConfig(e.target.value)}
          name="group1"
          type="radio"
          id={`inline-1`}
        />
        <Form.Check
          inline
          label="Auto"
          value={'Auto'}
          disabled={inputDisabled ? inputDisabled : false}
          defaultChecked={config === 'Auto' ? true : false}
          onClick={(e: any) => setConfig(e.target.value)}
          name="group1"
          type="radio"
          id={`inline-2`}
        />
        <Form.Text className="text-muted">
          In auto it will automatically accept all bookings
        </Form.Text>
      </div>
      {config === 'Auto' && (
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
                    disabled={inputDisabled ? inputDisabled : false}
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
      {config === 'Auto' && !fillSchedule && (
        <div className="mt-3">
          <Form.Label>Maximum Bookings per/day*</Form.Label>
          <Form.Control
            type="number"
            disabled={inputDisabled ? inputDisabled : false}
            max={12}
            min={0}
            value={bookings}
            onChange={(e: any) => setBookings(parseInt(e.target.value))}
          />
        </div>
      )}
    </>
  );
};

export default BookingConfig;
