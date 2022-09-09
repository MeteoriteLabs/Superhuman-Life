import React, {useState, useContext} from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import AddFitnessAddressModal from "../../../../components/customWidgets/AddFitnessAddressModal";

const PtProgramDetails = (props) => {

    const inputDisabled = props.readonly;

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
//     const [onlineClasses, setOnlineClasses] = useState<number>(existingData?.online ? existingData.online : 0);
//     const [offlineClasses, setOfflinceClasses] = useState<number>(existingData?.offline ? existingData.offline : 0);
//     const [restDays, setRestDays] = useState<number>(existingData?.rest ? existingData.rest : 0);

    console.log(singleSelections);

//     useEffect(() => {
//         if(onlineClasses > 30){
//             setOnlineClasses(30);
//         }
//         if(offlineClasses > 30){
//             setOfflinceClasses(30);
//         }
//         if(restDays > handleMax(mode)){
//             setRestDays(handleMax(mode));
//         }
//     }, [onlineClasses, offlineClasses, restDays, mode]);


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

//     function handleMax(mode: string){
//         if(mode === '0'){
//             return 30 - onlineClasses;
//         }
//         if(mode === '1'){
//             return 30 - offlineClasses;
//         }
//         if(mode === "2"){
//             return 30 - (onlineClasses + offlineClasses);
//         }
//         return 0;
//     }

    return (
        <>
            <div>
                <label><b>Mode</b></label>
                <Form>
                    <Form.Check inline label="Online" value='0' disabled={inputDisabled} defaultChecked={mode === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)} />
                    <Form.Check inline label="Offline" value='1' disabled={inputDisabled} defaultChecked={mode === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                </Form>
            </div>
            {mode !== '0' && 
            <>
            {mode !== '' && <div>
                <label><b>Location</b></label>
                <Row>
                    <Col lg={3}>
                        <Form.Group>
                            <Form.Control as="select" disabled={inputDisabled} value={addressTitle} onChange={(e: any) => {setAddressTitle(e.target.value)}}>
                                <option value="At My Address">At My Address</option>
                                <option value="At Client Address">At Client Address</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    {addressTitle === 'At My Address' && <Col>
                        <Typeahead
                            id="basic-typeahead-multiple"
                            labelKey="address1"
                            onChange={OnChange}
                            options={addresses}
                            placeholder="Search Address.."
                            selected={singleSelections}
                            disabled={inputDisabled}
                        />
                    </Col>}
                </Row>
                {addressTitle === 'At My Address' && <Row>
                    <Col lg={{offset: 3}}>
                         <Button variant='outline-info' disabled={inputDisabled} onClick={() => {setAddressModal(true)}}>+ Add New Address</Button>
                    </Col>
               </Row>}

               <AddFitnessAddressModal
                    show={addressModal}
                    onHide={() => {setAddressModal(false); handleCallback()}}
               />
            </div>}
        </>}
        </>
    );
}

export default PtProgramDetails;