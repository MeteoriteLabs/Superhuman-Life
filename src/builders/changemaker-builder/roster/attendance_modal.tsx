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
               // eslint-disable-next-line
               flattenData.sessionsBookings.map((val: any) => {
                    if(val?.client !== null){
                         return values.push({ username: val?.client?.username, attendance: handleUserAttendance(val?.Session_booking_status), bookingId: val?.id });
                    }
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

     function padTo2Digits(num) {
          return num.toString().padStart(2, '0');
      }

     function handleAttendanceCalculations(data: any[], statusToCheck?: string) {

          const filteredData = data.filter((session: any) => session.attendance === statusToCheck);
          return padTo2Digits(filteredData.length);
      }

     return (
          <Modal
               {...props}
               size="md"
               aria-labelledby="contained-modal-title-vcenter"
               backdrop="static"
               centered
          >
               <Modal.Body style={{ maxHeight: '400px', overflow: 'auto'}}>
                    <Row className='text-center border-bottom'>
                         <Col className='text-left h4'>Attendance</Col>

                         <Col className='text-center'>
                         <Row className=''>
                                <Col className='pl-1 pr-1 text-center'>
                                   <span className='small'>{padTo2Digits(attendanceData.length)}</span><br />
                                   <span className='small'>Total</span>
                                </Col>
                                <Col className='pl-1 pr-1 text-center'>
                                    <span className='small'>{handleAttendanceCalculations(attendanceData, 'Attended')}</span><br />
                                    <span className='small'>Present</span>
                                </Col>
                                <Col className='pl-1 pr-1 text-center'>
                                    <span className='small'>{handleAttendanceCalculations(attendanceData, 'Absent')}</span><br />
                                    <span className='small'>Absent</span>
                                </Col>
                            </Row>
                         </Col>
                    </Row>
                    {attendanceData.length === 0 && <div className='text-center mt-2'>No Clients</div>}
                    {!showData ? <div>Loading...</div> : attendanceData.map((item: any, index: any) => {
                         return (
                              <Container fluid>
                                   <Row className="mt-2 mb-2">
                                        <Col lg={8}>
                                             <img
                                                  src="https://picsum.photos/200/100" alt='profile-pic'
                                                  style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
                                                  />
                                             <span className='pl-3'>{item?.username}</span>
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