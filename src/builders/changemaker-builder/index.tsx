import React, { useEffect, useContext, useState } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import DayView from "./dayView";
import WeekView from "./weekView";
// import { GET_ALL_CLIENT_PACKAGE_BY_TYPE  } from './graphql/queries';
// import { useQuery } from '@apollo/client';
// import AuthContext from '../../context/auth-context';

export default function ProgramPage() {
  // const auth = useContext(AuthContext);
  // const [data, setData] = useState<any[]>([]);
  // const [show, setShow] = useState(false);

  // useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
  //     variables: {
  //         id: auth.userid,
  //         type_in: ['Personal Training','Group Class','Custom Fitness'],
  //     },
  //     onCompleted: (data) => {LoadData(data)}
  // });

  // function LoadData(data: any) {
  //     var sortedPrograms: any = [];
  //     // console.log(data);
  //     var Values: any = {};
  //     for(var i=0; i<data.userPackages.length; i++){
  //         if(data.userPackages[i].program_managers.length !== 0){
  //             if(data.userPackages[i].fitnesspackages[0].fitness_package_type.type === 'Group Class'){
  //                 for (var j=0; j<data.userPackages[i].program_managers[0].fitnessprograms.length; j++){
  //                     Values.effectiveDate = data.userPackages[i].program_managers[0].fitnessprograms[j].start_dt;
  //                     Values.program = data.userPackages[i].program_managers[0].fitnessprograms[j];
  //                     sortedPrograms.push(Values);
  //                     Values = {};
  //                 }
  //             }else {
  //                 for (var k=0; k<data.userPackages[i].program_managers[0].fitnessprograms.length; k++){
  //                     Values.effectiveDate = data.userPackages[i].effective_date.substring(0, data.userPackages[i].effective_date.indexOf('T'));
  //                     Values.program = data.userPackages[i].program_managers[0].fitnessprograms[k];
  //                     sortedPrograms.push(Values);
  //                     Values = {};
  //                 }
  //             }
  //         }
  //     }
  //     // console.log(sortedPrograms);
  //     handleDuplicates(sortedPrograms);
  // }

  // function handleDuplicates(sortedPrograms: any){
  //     if(sortedPrograms.length > 0){
  //         const values = [...sortedPrograms];
  //         for(var i=0; i<values.length; i++){
  //             for(var j=i+1; j<values.length-1; j++){
  //                 if(values[i].program.id === values[j].program.id){
  //                     values.splice(j, 1);
  //                 }
  //             }
  //         }
  //         setData(values);
  //         setShow(true);
  //     }
  // }

  // useEffect(() => {
  //     setTimeout(() => {
  //         setShow(true);
  //     }, 2000);
  // }, []);

  // console.log(data.length);

  // if(!show) return <div>Loading...</div>
  return (
    <>
      <h3>Schedule</h3>
      <Card>
        <Card.Body>
          <Tabs>
            <Tab eventKey="day" title="Day">
              <DayView />
            </Tab>
            <Tab eventKey="week" title="Week">
              <WeekView />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
}
