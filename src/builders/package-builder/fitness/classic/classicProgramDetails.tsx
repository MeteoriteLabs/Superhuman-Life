import React, {useState, useContext, useEffect} from 'react';
import {Row, Col, Form, InputGroup, FormControl, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import AddFitnessAddressModal from "../widgetCustom/AddFitnessAddressModal";

const PtProgramDetails = (props) => {
    const existingData = props.value === undefined ? undefined : JSON.parse(props.value);
    if(existingData !== undefined && existingData.length > 0){
        existingData.address = {id: JSON.parse(existingData?.address)[0].id, title: JSON.parse(existingData?.address)[0].title};

    }

    console.log(props);
    console.log(existingData);

    const [mode, setMode] = useState(props.value === undefined ? '' : (existingData.mode).toString());
    const [addressModal, setAddressModal] = useState(false);

    const auth = useContext(AuthContext); 
    const [singleSelections, setSingleSelections] = useState<any[]>(existingData?.address?.length !== 0 && props.value !== undefined ? existingData?.address : []);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressTitle, setAddressTitle] = useState(props.value !== undefined ? existingData.addressTag : 'At My Address');
    const [duration, setDuration] = useState(30);
    const [onlineClasses, setOnlineClasses] = useState<number>(existingData?.online ? existingData.online : 0);
//     const [offlineClasses, setOfflinceClasses] = useState<number>(existingData?.offline ? existingData.offline : 0);
    const [restDays, setRestDays] = useState<number>(existingData?.rest ? existingData.rest : 0);

    console.log(singleSelections);

//     useEffect(() => {
//           if(duration < 30){
//                setDuration(30);
//           }else if(duration > 365){
//                setDuration(365);
//           }

//     }, [duration]);


    const FETCH_USER_ADDRESSES = gql`
    query addresses($id: ID!) {
        addresses(filters: {
          users_permissions_user: {
            id: {
              eq: $id
            }
          }
        }){
          data{
              id
            attributes{
              address1
            }
          }
        }
      }
  `;

     const mainQuery = useQuery(FETCH_USER_ADDRESSES, {variables: {id: auth.userid},onCompleted: loadData});

    function loadData(data: any) {
        const flattenedData = flattenObj({...data});
        console.log(flattenedData);
        setAddresses(
              [...flattenedData.addresses].map((address) => {
                  return {
                      id: address.id,
                      address1: address.address1
                  }
              })
          );
    }


    function OnChange(e) {
        setSingleSelections(e);
    }

    function handleCallback(){
        mainQuery.refetch();
    }

//     function handleValidation(mode: string){
//         //here we will check for online
//         if(mode === '0'){
//             if((onlineClasses + restDays) === 30){
//                 return true;
//             }else {
//                 return false;
//             }
//         }
//         //here we will check for offline
//         if(mode === '1'){
//             if((restDays + offlineClasses) === 30){
//                 if(addressTitle === 'At My Address' && singleSelections.length !== 0){
//                     return true;
//                 }else {
//                     return false;
//                 }
//             }else {
//                 return false;
//             }
//         }
//         //here we will check for both(hybrid)
//         if(mode === "2"){
//             if((restDays + offlineClasses + onlineClasses) === 30){
//                 if(addressTitle === 'At My Address' && singleSelections.length !== 0){
//                     return true;
//                 }else {
//                     return false;
//                 }
//             }else {
//                 return false;
//             }
//         }
//     }

//     console.log(restDays, onlineClasses, offlineClasses);

//     useEffect(() => {
//         if(mode === "0"){
//             setOfflinceClasses(0);
//             setSingleSelections([]);
//         }else if(mode === "1"){
//             setOnlineClasses(0);
//         }
//     }, [mode]);

    if(mode === "0"){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode}));
    }else if((mode !== "" && (addressTitle === 'At My Address' && singleSelections.length !== 0)) || addressTitle === 'At Client Address') {
          props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode}));
    }else {
     props.onChange(undefined)
    }

    function handleMax(){
        return duration - onlineClasses;
    }

    return (
        <>
            <div>
                <label><b>Duration</b></label>
                <Form.Group>
                    <Form.Control type="number" min={30} max={365} value={duration} onChange={(e: any) => {
                         setDuration(e.target.value);
                    }} />
                </Form.Group>
            </div>
            <div className='m-5 p-2 text-center shadow-lg'>
               <h4>Set For {duration} Days</h4>
          </div>
          <Row>
               <Col lg={1}>
                    <img src='/assets/Classic.svg' alt='personal-training'/>
               </Col>
               <Col lg={2}>
                    <InputGroup className="mb-3">
                         <FormControl
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              type='number'
                              min={0}
                              max={28}
                              value={onlineClasses}
                              onChange={(e: any) => setOnlineClasses(parseInt(e.target.value))}
                         />
                    </InputGroup>
               </Col>
          </Row>
          <Row>
               <Col lg={1}>
                    <img src='/assets/rest-icon.svg' alt='rest-icon'/>
               </Col>
               <Col lg={1}>
                    <label><b>Rest Days</b></label>
               </Col>
               <Col lg={2}>
                    <InputGroup className="mb-3">
                         <FormControl
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              type='number'
                              min={0}
                              max={handleMax()}
                              value={restDays}
                              onChange={(e: any) => setRestDays(parseInt(e.target.value))}
                         />
                    </InputGroup>
               </Col>
            {/* <span className='small'>*It should add upto 30 classes per month</span> */}
          </Row>
        </>
    );
}

export default PtProgramDetails;