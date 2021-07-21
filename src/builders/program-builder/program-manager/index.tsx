import React, {useState} from 'react';
import { useQuery } from "@apollo/client";
import {GET_DATA} from './queries';

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
       console.log(data);
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
  console.log(data);
  if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
  else return (
     <div>
          <h1>{data[0].programName}</h1>
     </div>
  )
};

export default ProgramManager;