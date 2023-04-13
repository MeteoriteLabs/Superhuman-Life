import React from "react";
import Form from 'react-bootstrap/Form';

interface UserData {
  widgetProps: any;
  actionType: string;
  userData: any;
}

const BookingLeadday: React.FC<UserData> = (props) => {
  return (
    <>
      {props.userData.mode === 'Online' ||
      props.userData.mode === 'Offline' ||
      props.userData.mode === 'Hybrid' ? (
        <>
          <p>Consumer can choose start date, after</p>

          <Form.Group>
            <Form.Control
              disabled={props.actionType === 'view' ? true : false}
              as="select"
              aria-label="Default select example"
              value={props.widgetProps.value && props.widgetProps.value}
              onChange={(e) => props.widgetProps.onChange(e.target.value)}>
              <option>Select the lead day</option>
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
            </Form.Control>
          </Form.Group>

          <p>
            The lead time will allow you to discuss, understand, request data and then build a
            custom program{' '}
          </p>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default BookingLeadday;
