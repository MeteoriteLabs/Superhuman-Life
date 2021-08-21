import React, {useState, useEffect} from 'react';
import { useQuery } from "@apollo/client";
import {GET_TABLEDATA} from './queries';
import {  Row, Col } from 'react-bootstrap';
import Schedular from './schedular';

const ProgramManager = (props: any) => {
    const last = window.location.pathname.split('/').pop();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
       }, 1500)
    }, [show]);

    function FetchData(_variables: {} = {id: last}) {
        useQuery(GET_TABLEDATA, {variables: _variables, onCompleted: loadData});
    }

  function loadData(data: any) {
       setData(
          [...data.fitnessprograms].map((detail) => {
              return {
                  id: detail.id,
                  programName: detail.title,
                  discipline: detail.fitnessdisciplines.map((val: any) => {
                      return val.disciplinename;
                  }).join(", "),
                  level: detail.level,
                  duration: detail.duration_days,
                  details: detail.description
              }
          })
      )
  }

  FetchData({id: last});
  if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
else return (
      <>
      <Row>
    <Col lg={11}>
        <div className="p-4 shadow-lg bg-white" style={{ borderRadius: '10px'}}>
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
            </Col>
        </div>
        <div className="mt-5">
            <Schedular days={12} programId={last}/>
        </div>
    </Col>
    </Row>
     </>
  )
};
export default ProgramManager;