import React, {useState, useContext} from 'react';
import {Row, Col, Form, InputGroup, FormControl, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';
import AddFitnessAddressModal from "../../widgetCustom/AddFitnessAddressModal";

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
    const [onlineClasses, setOnlineClasses] = useState<number>(0);
    const [offlineClasses, setOfflinceClasses] = useState<number>(0);
    const [restDays, setRestDays] = useState<number>(0);

    console.log(singleSelections);


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

    if(mode === "0" && restDays + onlineClasses === 30){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode}));
    }else if(mode === "1" && addressTitle === "At My Address" && singleSelections.length !== 0 && restDays + offlineClasses === 30){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode}));
    }else if(mode === "1" && addressTitle === "At Client Address" && restDays + offlineClasses === 30){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode}));
    }

    return (
        <>
            <div>
                <label><b>Mode</b></label>
                <Form>
                    <Form.Check inline label="Online" value='0' defaultChecked={mode === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)} />
                    <Form.Check inline label="Offline" value='1' defaultChecked={mode === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                    <Form.Check inline label="Hybrid" value='2' defaultChecked={mode === '2' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                </Form>
            </div>
            {mode !== '0' && 
            <>
            {mode !== '' && <div>
                <label><b>Location</b></label>
                <Row>
                    <Col lg={3}>
                        <Form.Group>
                            <Form.Control as="select" value={addressTitle} onChange={(e: any) => {setAddressTitle(e.target.value)}}>
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
                        />
                    </Col>}
                </Row>
                <Row>
                    <Col lg={{offset: 3}}>
                         <Button variant='outline-info' onClick={() => {setAddressModal(true)}}>+ Add New Address</Button>
                    </Col>
               </Row>

               <AddFitnessAddressModal
                    show={addressModal}
                    onHide={() => {setAddressModal(false); handleCallback()}}
               />
            </div>}
        </>}
          <div className='m-5 p-2 text-center shadow-lg'>
               <h4>Set For One Month (30 Days)</h4>
          </div>
          {mode !== "" && (mode === "0" || mode === "2") && <Row>
               <Col lg={1}>
                    <img src='/assets/personal-training-online.svg' alt='personal-training'/>
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
          </Row>}
          {mode !== "" && (mode === "1" || mode === "2") && <Row>
               <Col lg={1}>
                    <img src='/assets/personal-training-offline.svg' alt='personal-training'/>
               </Col>
               <Col lg={2}>
                    <InputGroup className="mb-3">
                         <FormControl
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              type='number'
                              min={2}
                              max={10}
                              value={offlineClasses}
                              onChange={(e: any) => setOfflinceClasses(parseInt(e.target.value))}
                         />
                    </InputGroup>
               </Col>
          </Row>}
          {mode !== "" && <Row>
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
                              value={restDays}
                              onChange={(e: any) => setRestDays(parseInt(e.target.value))}
                         />
                    </InputGroup>
               </Col>
          </Row>}
        </>
    );
}

export default PtProgramDetails;