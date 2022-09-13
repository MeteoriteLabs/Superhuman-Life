import React, {useState, useContext} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';

const ProgramDetails = (props) => {

    const inputDisabled = props.readonly;

    const existingData = props.value === undefined ? undefined : JSON.parse(props.value);
    if(existingData !== undefined && existingData.length > 0){
        existingData.address = {id: JSON.parse(existingData?.address)[0].id, title: JSON.parse(existingData?.address)[0].title};

    }

    console.log(props);
    console.log(existingData);

    const [mode, setMode] = useState(props.value === undefined ? '' : (existingData.mode).toString());
    const [residential, setResidential] = useState(props.value === undefined || existingData.residential === null ? '' : (existingData.residential).toString());

    const auth = useContext(AuthContext); 
    const [singleSelections, setSingleSelections] = useState<any[]>(existingData?.address?.length !== 0 && props.value !== undefined ? existingData?.address : []);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressTitle, setAddressTitle] = useState(props.value !== undefined ? existingData.addressTag : 'At My Address');

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

    function FetchData(){
        useQuery(FETCH_USER_ADDRESSES, {variables: {id: auth.userid},onCompleted: loadData});
    }

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

    FetchData();

    function OnChange(e) {
        setSingleSelections(e);
    }

    if(mode === "0"){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    }else if(mode === "1" && addressTitle === "At My Address" && singleSelections.length !== 0){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    }else if(mode === "2" && addressTitle === "At My Address" && singleSelections.length !== 0 && residential !== ""){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    }else if(mode === "1" && addressTitle === "At Client Address"){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    }else if(mode === "2" && addressTitle === "At Client Address"){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    }

    return (
        <>
            <div>
                <label><b>Mode</b></label>
                <Form>
                    <Form.Check inline label="Online" disabled={inputDisabled} value='0' defaultChecked={mode === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)} />
                    <Form.Check inline label="Offline" disabled={inputDisabled} value='1' defaultChecked={mode === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                    <Form.Check inline label="Residential" disabled={inputDisabled} value='2' defaultChecked={mode === '2' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
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
            </div>}
            {mode !== '' && mode === '2' && <div>
                <label><b>Residential</b></label>
                <Form>
                    <Form.Check inline label="Accommodation" disabled={inputDisabled} value='0' defaultChecked={residential === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setResidential(e.target.value)} />
                    <Form.Check inline label="Accommodation + Food" value='1' disabled={inputDisabled} defaultChecked={residential === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setResidential(e.target.value)}/>
                </Form>
            </div>}
        </>}
        </>
    );
}

export default ProgramDetails;