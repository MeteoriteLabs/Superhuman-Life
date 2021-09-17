import React, { useState, useEffect} from 'react';
import { Form, InputGroup, FormControl, Table } from 'react-bootstrap';
import DaysInput from './daysInput';

const TransferProgramTable = (props: any) => {

     const [show, setShow] = useState(false);
     const [data, setData] = useState<any[]>([]);
     const [errorClass, setErrorClass] = useState({d: '', i: null});

     function handleDaysData(e: any, index: any) {
          const values = [...data];
          let a = values.find(e => e.transferId === index);
          a.day = e;
          setData(values); 
     }

     function handleHourChange(e: any, index: any){
          const values = [...data];
          let a = values.find(e => e.transferId === index);
          a.startTimeHour = e;
          setData(values);
     }

     function handleMinChange(e: any, index: any){
          const values = [...data];
          let a = values.find(e => e.transferId === index);
          a.startTimeMin = e;
          setData(values);
     }

     function handleTransfer(e: any){
          const values = [...data];
          for(var i=0; i<e.length; i++){
               values.push({name: e[i].name, transferId: i, id: e[i].id, type: e[i].type});
          }
          setData(values);
     }

     useEffect(() => {
          handleTransfer(props.events);
          setTimeout(() => {
               setShow(true);
          }, 500);
     }, []);

     props.onChange(data);

     if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
          else return (
               <Table responsive>
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
                                        <td><Form.Control value={val.name} disabled></Form.Control></td>
                                        <td>to</td>
                                        <td><DaysInput onChange={(e) => {handleDaysData(e, index)}} type="transfer"/></td>
                                        <td><InputGroup>
                                             <FormControl
                                             placeholder="24Hr"
                                             className={`${(data[index].day &&  !data[index].startTimeHour)  ?  'inputError' : ''}`}
                                             type="number"
                                             min="0"
                                             max="23"
                                             id={index}
                                             autoComplete="off"
                                             value={data[index].startTimeHour === undefined ? '' : data[index].startTimeHour}
                                             onChange={(e) => {handleHourChange(e.target.value, index)}}
                                        />
                                        <InputGroup.Text id="basic-addon2">hr</InputGroup.Text>
                                   </InputGroup></td>
                                   <td>
                                   <InputGroup>
                                        <Form.Control as="select" value={data[index].startTimeMin === undefined ? '' : data[index].startTimeMin} onChange={(e) => handleMinChange(e.target.value, index)}>
                                             <option>0</option>
                                             <option>15</option>
                                             <option>30</option>
                                             <option>45</option>
                                        </Form.Control>
                                             <InputGroup.Text id="basic-addon2">m</InputGroup.Text>
                                        </InputGroup>
                                   </td>
                                   </tr>
                                   )
                              })}
                    </tbody>
               </Table>
          )
}

export default TransferProgramTable;

