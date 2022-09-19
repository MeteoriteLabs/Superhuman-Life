import React, {useEffect, useState} from 'react';
import { Form } from 'react-bootstrap';

const BookingConfig = (props: any) => {

     const inputDisabled = props.uiSchema.readonly;

     // const [fillSchedule, setFillSchedule] = useState(props.value !== undefined ? JSON.parse(props.value).fillSchedule : false);
     const [config, setConfig] = useState(props.value !== undefined ? JSON.parse(props.value).config : "");
     const [bookings, setBookings] = useState(props.value !== undefined ? JSON.parse(props.value).bookings : 0);

     function handleValidation(){
          if(config !== "" && config === "Manual"){
               return true;
          }else if(config === "Auto" && bookings !== 0){
               return true;
          }else {
               return false;
          }
          // if(fillSchedule && config !== "" && config !== "Auto"){
          //      return true;
          // }else if(!fillSchedule && config !== "" && config !== "Auto"){
          //      return true;
          // }else if(config === "Auto" && bookings !== 0){
          //      return true;
          // }else {
          //      return false;
          // }
     }


     useEffect(() => {

          if(handleValidation()){
               props.onChange(JSON.stringify({config: config, bookings: bookings}));
          }else {
               props.onChange(undefined);
          }
          //eslint-disable-next-line
     }, [config, bookings]);

     return (
          <>
               {/* <div className='ml-3 mb-3'>
                    <Row>
                         <span>Fill My schedule &nbsp;</span>
                         <Form.Check 
                              type="switch"
                              id="custom-switch"
                              defaultChecked={fillSchedule}
                              onChange={(e) => setFillSchedule(!fillSchedule)}
                         />
                    </Row>
               </div> */}
               <div>
                    <Form.Check inline label="Manual" value={"Manual"} disabled={inputDisabled} defaultChecked={config === "Manual" ? true : false} onClick={(e: any) => setConfig(e.target.value)} name="group1" type='radio' id={`inline-1`} />
                    <Form.Check inline label="Auto" value={"Auto"} disabled={inputDisabled} defaultChecked={config === "Auto" ? true : false} onClick={(e: any) => setConfig(e.target.value)} name="group1" type='radio' id={`inline-2`} />
                    <Form.Text className="text-muted">
                         In auto it will automatically accept all bookings
                    </Form.Text>
               </div>
               {config === 'Auto' && <div className='mt-3'>
                    <Form.Label>Maximum Bookings per/month*</Form.Label>
                    <Form.Control type="number" max={300} disabled={inputDisabled} min={0} value={bookings} onChange={(e: any) => setBookings(parseInt(e.target.value))} />
                    {/* <Form.Text className="text-muted">
                         We'll never share your email with anyone else.
                    </Form.Text> */}
               </div>}
          </>
     );
};

export default BookingConfig;