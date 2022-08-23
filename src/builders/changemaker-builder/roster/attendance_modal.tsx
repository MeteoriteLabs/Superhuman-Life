import React, { useState } from 'react';
import {Modal, Button, Row, Col, Container} from 'react-bootstrap';
import {GET_PARTICULAR_CLIENT} from './graphql/queries';
import { useQuery, useMutation } from '@apollo/client';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { UPDATE_ATTENDANCE_DATA } from './graphql/queries';
import moment from 'moment';

const AttendanceModal = (props: any) => {

     const [attendanceData, setAttendanceData] = useState<any>([]);
     const [showData, setShowData] = useState<boolean>(false);
     const [sessionDate, setSessionDate] = useState<string>('');

     const [updateAttendance] = useMutation(UPDATE_ATTENDANCE_DATA);

     useQuery(GET_PARTICULAR_CLIENT, {
          variables: {
               id: window.location.pathname.split('/').pop()
          },
          onCompleted: (data) => {
               const flattenData = flattenObj({...data});
               setSessionDate(flattenData?.sessionsBookings[0]?.session?.session_date);
               const values = [...attendanceData];
               flattenData.sessionsBookings.map((val: any) => {
                    return values.push({ username: val.client.username, attendance: handleUserAttendance(val.Session_booking_status), bookingId: val.id });
               });
               setAttendanceData(values);
               setShowData(true);
          }
     });

     function handleUserAttendance(val: any){
          if(val === 'Attended'){
               return 'Attended';
          }else if(val === 'Absent'){
               return 'Absent';
          }else {
               return val;
          }
     }

     function handlePresentClicked(id: number){
          const values = [...attendanceData];
          // eslint-disable-next-line
          values.map((val: any, index: number) => {
               if(index === id){
                    return val.attendance = 'Attended';
               }
          });
          setAttendanceData(values);
     }

     function handleAbsentClicked(id: number){
          const values = [...attendanceData];
          // eslint-disable-next-line
          values.map((val: any, index: number) => {
               if(index === id){
                    return val.attendance = 'Absent';
               }
          }
          );
          setAttendanceData(values);
     }

     function handleSessionAttendanceUpdate(data: any){
          for(var i=0; i<data.length; i++){
               updateAttendance({variables: {
                    id: data[i].bookingId,
                    status: data[i].attendance
               }});
          }
          props.onHide();
     }

     function handleAttendanceDisable(date: string){
          var duration = moment().diff(moment(date));
          if((duration/(1000 * 3600)) > 12){
               return true;
          }else {
               return false;
          }
     }

     return (
          <Modal
               {...props}
               size="lg"
               aria-labelledby="contained-modal-title-vcenter"
               backdrop="static"
               centered
          >
               <Modal.Header>
               <Modal.Title id="contained-modal-title-vcenter">
                    Attendance
               </Modal.Title>
               </Modal.Header>
               <Modal.Body>
                    <Row className='border-top border-bottom pl-3 pr-3'>
                         <Col lg={8}>
                              <span>Name</span>
                         </Col>
                         <Col className='text-center'>
                              <span>Mark Attendance</span>
                         </Col>
                    </Row>
                    {!showData ? <div>Loading...</div> : attendanceData.map((item: any, index: any) => {
                         return (
                              <Container fluid>
                                   <Row className="mt-2 mb-2">
                                        <Col lg={8}>
                                             <img
                                                  src="https://picsum.photos/200/100" alt='profile-pic'
                                                  style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
                                                  /><br />
                                             <span>{item?.username}</span>
                                        </Col>
                                        <Col className='text-center'>
                                             <Row className='justify-content-between'>
                                                  <div 
                                                       className={`border border-success p-1 pl-2 pr-2 rounded-lg 
                                                       ${item?.attendance === 'Attended' ? 'text-light bg-success' : 'text-success'}`}
                                                       style={{ cursor: 'pointer' }}
                                                       onClick={() => {
                                                            if(!handleAttendanceDisable(sessionDate)){
                                                                 handlePresentClicked(index);
                                                            }
                                                       }}
                                                  >
                                                       Present
                                                  </div>
                                                  <div 
                                                       className={`border border-danger p-1 rounded-lg pl-2 pr-2 ${item?.attendance === 'Absent' ? 'text-light bg-danger' : 'text-danger'}`}
                                                       style={{ cursor: 'pointer' }}
                                                       onClick={() => {
                                                            if(!handleAttendanceDisable(sessionDate)){
                                                                 handleAbsentClicked(index);
                                                            }
                                                       }}
                                                  >
                                                       Absent
                                                  </div>

                                             </Row>
                                        </Col>
                                   </Row>
                              </Container>
                         );
                    })}
               </Modal.Body>
               <Modal.Footer>
                    <Button variant='danger' onClick={props.onHide}>Close</Button>
                    <Button variant='success' disabled={handleAttendanceDisable(sessionDate)} onClick={() => {
                         handleSessionAttendanceUpdate(attendanceData);
                    }}>Update</Button>
               </Modal.Footer>
          </Modal>
     );
};

export default AttendanceModal;