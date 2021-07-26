import React, {useState} from 'react';
import { useQuery } from "@apollo/client";
import {GET_DATA} from './queries';
import {  Row, Col } from 'react-bootstrap';
import Schedular from './schedular';

const ProgramManager = (props) => {
     const last = window.location.pathname.split('/').pop();
     const [data, setData] = useState<any[]>([]);
     const [show, setShow] = React.useState(false)

     React.useEffect(() => {
        setTimeout(() => {
            setShow(true)
       }, 1500)
     }, [show]);

  function FetchData(_variables: {} = {id: last}) {
     useQuery(GET_DATA, {variables: _variables, onCompleted: loadData});
  }

  function loadData(data: any) {
       setData(
          [...data.fitnesssProgramTemplates].map((detail) => {
              return {
                  id: detail.id,
                  programName: detail.Program_template_name,
                  discipline: detail.fitnessdisciplines.map((val: any) => {
                      return val.disciplinename;
                  }).join(", "),
                  level: detail.level,
                  duration: detail.Duration,
                  details: detail.Details,
                  equipment: detail.equipment_lists.map((equipment: any) => {
                      return equipment.name
                  }).join(", ")
              }
          })
      )
  }

  FetchData({id: last});
  if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
  else return (
      <>
        <div className="mr-5 p-4 shadow-lg rounded bg-white">
            <Col>
                <Row>
                    <h3>{data[0].programName.charAt(0).toUpperCase() + data[0].programName.slice(1)}</h3>
                </Row>
                <Row className="mt-4">
                    <span><b>Discpline</b></span>
                    <span className="ml-4">{data[0].discipline}</span>
                    <div className="ml-3 mt-1" style={{ borderLeft: '1px solid black', height: '20px'}}></div>
                    <span className="ml-4">{data[0].duration + " days"}</span>
                    <div className="ml-3" style={{ borderLeft: '1px solid black', height: '20px'}}></div>
                    <span className="ml-4">{"Level: " + data[0].level}</span>
                </Row>
                <Row className="mt-4">
                    <span><b>Equipment</b></span>
                    <span className="ml-4">{data[0].equipment}</span>
                </Row>
            </Col>
        </div>
        <div className="mt-5  mr-5">
            <Schedular days={9}/>
        </div>
     </>
  )
};
export default ProgramManager;