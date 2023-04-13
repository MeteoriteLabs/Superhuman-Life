import React, { useEffect, useState } from 'react';
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const ClassicProgramDetails: React.FC<{
  readonly: boolean;
  value: string;
  onChange: (args: string | null) => void;
}> = (props) => {
  const inputDisabled = props.readonly;
  const existingData = props.value === undefined ? undefined : JSON.parse(props.value);
  if (existingData && existingData.length > 0) {
    existingData.address = {
      id: JSON.parse(existingData?.address)[0].id,
      title: JSON.parse(existingData?.address)[0].title
    };
  }
  const [duration, setDuration] = useState(existingData?.duration ? existingData?.duration : 1);
  const [onlineClasses, setOnlineClasses] = useState<number>(
    existingData?.online ? existingData.online : 0
  );
  const [restDays, setRestDays] = useState<number>(existingData?.rest ? existingData.rest : 0);

  function handleValidation() {
    if (onlineClasses === 0) {
      return false;
    }

    if (onlineClasses + restDays === duration) {
      return true;
    }
  }

  if (handleValidation()) {
    props.onChange(
      JSON.stringify({
        duration: duration,
        online: onlineClasses,
        rest: restDays
      })
    );
  } else {
    props.onChange(null);
  }

  useEffect(() => {
    if (duration - onlineClasses > 0) {
      setRestDays(duration - onlineClasses);
    }
    if (duration === 1) {
      setRestDays(0);
    }
  }, [duration, onlineClasses]);

  return (
    <>
      <div>
        <label>
          <b>Duration</b>
        </label>
        <Form.Group>
          <Form.Control
            disabled={inputDisabled}
            type="number"
            min={30}
            max={365}
            value={duration}
            onChange={(e: any) => {
              setDuration(parseInt(e.target.value));
            }}
          />
        </Form.Group>
      </div>
      <div className="m-5 p-2 text-center shadow-lg">
        <h4>Set For {duration} Days</h4>
      </div>
      <label>
        <b>Enter Number of Sessions</b>
      </label>
      <Row>
        <Col lg={1}>
          <img src="/assets/Classic.svg" alt="personal-training" />
        </Col>
        <Col lg={2}>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="number"
              min={0}
              max={365}
              disabled={inputDisabled}
              value={onlineClasses}
              onChange={(e: any) => setOnlineClasses(parseInt(e.target.value))}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon1">Sessions</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <label>
        <b>Rest Days</b>
      </label>
      <Row>
        <Col lg={2}>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="number"
              min={0}
              value={restDays}
              disabled={true}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon1">Days</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </>
  );
};

export default ClassicProgramDetails;
