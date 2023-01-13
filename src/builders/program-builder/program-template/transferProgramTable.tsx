import { useState, useEffect } from "react";
import { Form, Table } from "react-bootstrap";
import DaysInput from "./daysInput";
import moment from "moment";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

const TransferProgramTable = (props: any) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);

  function handleStartTimeInput(val: any, index: any) {
    var m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60;
    handleHourChange(val.slice(0, 2) + ":" + (m === 0 ? "00" : m), index);
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

  function handleDaysData(e: any, index: any) {
    const values = [...data];
    let a = values.find((e) => e.transferId === index);
    a.day = e;
    setData(values);
  }

  function handleHourChange(e: any, index: any) {
    const values = [...data];
    let a = values.find((e) => e.transferId === index);
    a.startTime = handleFormatting(e);
    setData(values);
  }

  function handleTransfer(e: any) {
    const values = [...data];
    for (var i = 0; i < e.length; i++) {
      values.push({
        name:
          e[i].workout === null
            ? e[i].activity.title
            : e[i].workout.workouttitle,
        transferId: i,
        id: e[i].id,
        type: e[i].type,
        startTime: e[i].start_time,
        endTime: e[i].end_time,
        Is_restday: e[i].Is_restday,
        activity: e[i].activity,
        activity_target: e[i].activity_target,
        changemaker: e[i]?.changemaker.id,
        day_of_program: e[i].day_of_program,
        mode: e[i].mode,
        tag: e[i].tag,
        workout: e[i].workout,
      });
    }
    setData(values);
  }

  useEffect(() => {
    handleTransfer(props.events);
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    props.onChange(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return <span style={{ color: "red" }}>Loading...</span>;
  else
    return (
      <Table responsive style={{ overflow: "auto" }}>
        <thead>
          <tr className="text-center">
            <th colSpan={1}>From template</th>
            <th colSpan={11}>To scheduler</th>
          </tr>
        </thead>
        <tbody>
          {props.events.map((val: any, index) => {
            return (
              <tr>
                <td>
                  <Form.Control
                    style={{ minWidth: "150px" }}
                    value={
                      val.workout === null
                        ? val.activity.title
                        : val.workout.workouttitle
                    }
                    disabled
                  ></Form.Control>
                </td>
                <td>to</td>
                <td style={{ minWidth: "150px" }}>
                  <DaysInput
                    duration={props.duration.length}
                    dayType={props.dayType}
                    onChange={(e) => {
                      handleDaysData(e, index);
                    }}
                    type="transfer"
                  />
                </td>
                <td style={{ minWidth: "150px" }}>
                  <TimePicker
                    value={convertToMoment(data[index].startTime)}
                    disabled={props.disabled ? props.disabled : false}
                    showSecond={false}
                    minuteStep={15}
                    onChange={(e) => {
                      if (e !== null) {
                        handleHourChange(e.format("HH:mm"), index);
                      } else {
                        handleStartTimeInput("00:00", index);
                      }
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
};

export default TransferProgramTable;
