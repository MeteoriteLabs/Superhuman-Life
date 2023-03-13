import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const BookingConfig = (props: any) => {
  const inputDisabled = props.uiSchema.readonly;
  const [config, setConfig] = useState(
    props.value !== undefined ? JSON.parse(props.value).config : "Manual"
  );
  const [bookings, setBookings] = useState(
    props.value !== undefined ? JSON.parse(props.value).bookings : 0
  );

  function handleValidation() {
    if (config !== "" && config === "Manual") {
      return true;
    } else if (config === "Auto" && bookings !== 0) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (bookings > 30) {
      setBookings(30);
    }
  }, [bookings]);

  useEffect(() => {
    if (handleValidation()) {
      props.onChange(JSON.stringify({ config: config, bookings: bookings }));
    } else {
      props.onChange(undefined);
    }
    //eslint-disable-next-line
  }, [config, bookings]);

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
          Manual: Allows you to accept or reject a user, Auto: it will
          automatically accept all bookings
        </Form.Text>
      </div>
      {config === "Auto" && (
        <div className="mt-3">
          <Form.Label>Maximum Bookings per/month*</Form.Label>
          <Form.Control
            type="number"
            max={300}
            disabled={inputDisabled}
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
