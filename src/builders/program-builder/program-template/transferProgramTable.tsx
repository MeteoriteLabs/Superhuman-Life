import { useState, useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import DaysInput from './daysInput';
// import SingleTimeField from '../../../components/customWidgets/singleTimeField';
// import React, { useState } from 'react';
// import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const TransferProgramTable = (props: any) => {
    const [show, setShow] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);

    function handleStartTimeInput(val: any, index: any) {
        handleHourChange(val.$H + ':' + (val.$m === 0 ? '00' : val.$m), index);
    }

    function convertToMoment(time: string) {
        const timeSplit = time.split(':').map(Number);
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
    }

    function handleFormatting(time) {
        const inputTime: any = time.split(':');
        return `${parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]}:${
            inputTime[1] === '00' ? '0' : inputTime[1]
        }`;
    }

    function handleDaysData(e: any, index: any) {
        const values = [...data];
        const a = values.find((e) => e.transferId === index);
        a.day = e;
        setData(values);
    }

    function handleHourChange(val: any, index: any) {
        const e = val.$H + ':' + (val.$m === 0 ? '00' : val.$m);
        const values = [...data];
        const a = values.find((e) => e.transferId === index);
        a.startTime = handleFormatting(e);
        setData(values);
    }

    // function handleMinChange(e: any, index: any){
    //      const values = [...data];
    //      let a = values.find(e => e.transferId === index);
    //      a.startTimeMin = e;
    //      setData(values);
    // }

    function handleTransfer(e: any) {
        const values = [...data];
        for (let i = 0; i < e.length; i++) {
            values.push({
                name: e[i].workout === null ? e[i].activity.title : e[i].workout.workouttitle,
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
                workout: e[i].workout
            });
        }
        setData(values);
    }

    useEffect(() => {
        handleTransfer(props.events);
        setTimeout(() => {
            setShow(true);
        }, 500);
    }, []);

    useEffect(() => {
        props.onChange(data);
    }, [data]);

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else
        return (
            <Table responsive style={{ overflow: 'auto' }}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={1}>From template</th>
                        <th colSpan={11}>To scheduler</th>
                    </tr>
                </thead>
                <tbody>
                    {props.events.map((val: any, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        style={{ minWidth: '150px' }}
                                        value={
                                            val.workout === null
                                                ? val.activity.title
                                                : val.workout.workouttitle
                                        }
                                        disabled
                                    ></Form.Control>
                                </td>
                                <td>to</td>
                                <td style={{ minWidth: '150px' }}>
                                    <DaysInput
                                        duration={props.duration.length}
                                        dayType={props.dayType}
                                        onChange={(e) => {
                                            handleDaysData(e, index);
                                        }}
                                        type="transfer"
                                    />
                                </td>
                                {/* <Row> */}
                                {/* <Col lg={4}> */}

                                <td style={{ minWidth: '150px' }}>
                                    <StyledEngineProvider injectFirst>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                viewRenderers={{
                                                    hours: renderTimeViewClock,
                                                    minutes: renderTimeViewClock
                                                }}
                                                minutesStep={15}
                                                disabled={props.disabled ? props.disabled : false}
                                                onChange={(e) => {
                                                    if (e !== null) {
                                                        handleHourChange(e, index);
                                                    } else {
                                                        handleStartTimeInput(e, index);
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </StyledEngineProvider>
                                </td>

                                {/* </Col> */}
                                {/* </Row> */}
                                {/* <td><SingleTimeField onChange={(e) => handleHourChange(e, index)} /></td> */}
                                {/* <td><InputGroup>
                                             <FormControl
                                             placeholder="24Hr"
                                             type="number"
                                             min="0"
                                             max="23"
                                             isInvalid={(data[index].day &&  !data[index].startTimeHour)  ?  true : false}
                                             id={index}
                                             autoComplete="off"
                                             value={data[index].startTimeHour === undefined ? '' : data[index].startTimeHour}
                                             onChange={(e) => {handleHourChange(e.target.value, index)}}
                                        />
                                        <InputGroup.Text id="basic-addon2">hr</InputGroup.Text>
                                   </InputGroup></td> */}
                                {/* <td>
                                   <InputGroup>
                                        <Form.Control as="select" value={data[index].startTimeMin === undefined ? '' : data[index].startTimeMin} onChange={(e) => handleMinChange(e.target.value, index)}>
                                             <option>0</option>
                                             <option>15</option>
                                             <option>30</option>
                                             <option>45</option>
                                        </Form.Control>
                                             <InputGroup.Text id="basic-addon2">m</InputGroup.Text>
                                        </InputGroup>
                                   </td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
};

export default TransferProgramTable;
