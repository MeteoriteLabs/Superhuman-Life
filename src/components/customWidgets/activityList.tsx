import React, {useState} from 'react';
import { InputGroup, Row, Col, Form } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import ActivityBuilder from './activityBuilder';

const ActivityField = (props: any) => {

     const [activity, setActivity] = useState<any[]>([]);
     const [selected, setSelected] = useState<any>({});

     const FETCH_ACTIVITIES = gql`
          query activities{
               activities(sort: "updatedAt"){
                    id
                    title
               }
          }
     `

     function FetchData(){
          useQuery(FETCH_ACTIVITIES, {onCompleted: loadData});
      }
  
     function loadData(data: any) {
          setActivity(
              [...data.activities].map((activity) => {
                  return {
                      id: activity.id,
                      title: activity.title
                  }
              })
          );
     }

     FetchData();

     // if(selected === 'none'){
     //      setDetailsDiv('block');
     // }

     function OnChange(data: any){
          const objectToString = JSON.stringify(data);
          props.onChange(objectToString);
     }

     function handleSelect(data: any){  
          const values = [...activity];
          let a = values.find((e) => e.title === data);
          setSelected(a);
     }

     return (
          <>
          <label>Select Activity</label>
          <Row className="pl-2 pr-2">
               <Col xs={12}>
               <InputGroup>
                    <Form.Control as="select" defaultValue="" placeholder="Choose one Activity" onChange={(e) =>{
                         handleSelect(e.target.value);
                    }}>
                         <option></option>
                         {activity.map((activity) => {
                              return (
                                   <option key={activity.id}>{activity.title}</option>
                              )
                         })}
                    </Form.Control>
               </InputGroup>
               </Col>
          </Row>
          <div>
               <ActivityBuilder activity={selected} onChange={OnChange}/>
          </div>
          </>
     )
}

export default ActivityField;