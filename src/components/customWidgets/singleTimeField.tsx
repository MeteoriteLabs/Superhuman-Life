import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

const TimeFieldInput = (props: any) => {
  const [startTime, setStartTime] = useState("00:00");

  function handleStartTimeInput(val: any) {
    var m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60;
    setStartTime(val.slice(0, 2) + ":" + (m === 0 ? "00" : m));
  }

  function convertToMoment(time: string) {
    var timeSplit = time.split(":").map(Number);
    return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
  }

  function handleFormatting(time) {
    var inputTime: any = time.split(":");
    return `${
      parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]
    }:${inputTime[1] === "00" ? "0" : inputTime[1]}`;
  }

  props.onChange(JSON.stringify(handleFormatting(startTime)));

  return (
    <>
      <Row>
        <Col lg={4}>
          <TimePicker
            value={convertToMoment(startTime)}
            disabled={props.disabled ? props.disabled : false}
            showSecond={false}
            minuteStep={15}
            onChange={(e) => {
              handleStartTimeInput(moment(e).format("HH:mm"));
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default TimeFieldInput;
