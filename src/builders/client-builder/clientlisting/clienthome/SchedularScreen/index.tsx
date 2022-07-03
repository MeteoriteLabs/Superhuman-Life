import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Schedular from '../../../../program-builder/program-template/scheduler';

const SchedularScreen = (props: any) => {
    const last = window.location.pathname.split('/').pop();
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show]);


    if (!show){
         return <div className="text-center">
               <Spinner animation="border" variant="danger" />
               <br />
               <div className='mt-3' style={{ fontWeight: 'bold'}}>Please wait while we load the client's schedule...</div>
          </div>;
    } 

    else return (
        <>
          <Schedular days={30} restDays={[]} programId={last} clientSchedular={'client'}/>
          
        </>
    )
};
export default SchedularScreen;

{/* <SchedulerPage type="date" days={tag?.fitnesspackage?.duration} classType={'Personal Training'} restDays={tag?.sessions.filter((ses) => ses.type === "restday")} programId={tagId} startDate={tag?.client_packages[0].effective_date} clientId={tag.client_packages[0].users_permissions_user.id}/> */}