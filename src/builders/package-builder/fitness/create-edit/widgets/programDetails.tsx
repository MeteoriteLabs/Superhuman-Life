import React, {useState, useContext} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';

const ProgramDetails = (props) => {

    const existingData = props.value !== undefined && JSON.parse(props.value);
    console.log(existingData);

    const [mode, setMode] = useState(props.value === undefined ? '' : (existingData.mode).toString());
    const [residential, setResidential] = useState(props.value === undefined ? '' : (existingData.residential).toString());

    const auth = useContext(AuthContext); 
    const [singleSelections, setSingleSelections] = useState<any[]>(existingData?.address?.length !== 0 ? existingData?.address : []);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressTitle, setAddressTitle] = useState(props.value !== undefined ? existingData.addressTag : 'At My Address');

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
                      title: address.address1
                  }
              })
          );
    }

    FetchData();

    function OnChange(e) {
        setSingleSelections(e);
    }

    // console.log({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential});

    props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));

    return (
        <>
            <div>
                <label><b>Mode</b></label>
                <Form>
                    <Form.Check inline label="Online" value='0' checked={mode === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)} />
                    <Form.Check inline label="Offline" value='1' checked={mode === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                    <Form.Check inline label="Hybrid" value='2' checked={mode === '2' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                    <Form.Check inline label="Residential" value='3' checked={mode === '3' ? true : false} name="group1" type='radio' onClick={(e: any) => setMode(e.target.value)}/>
                </Form>
            </div>
            {mode !== '0' && 
            <>
            <div>
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
                            labelKey="title"
                            onChange={OnChange}
                            options={addresses}
                            placeholder="Search Address.."
                            selected={singleSelections}
                        />
                    </Col>}
                </Row>
            </div>
            <div>
                <label><b>Residential</b></label>
                <Form>
                    <Form.Check inline label="Accommodation" value='0' checked={residential === '0' ? true : false} name="group1" type='radio' onClick={(e: any) => setResidential(e.target.value)} />
                    <Form.Check inline label="Accommodation + Food" value='1' checked={mode === '1' ? true : false} name="group1" type='radio' onClick={(e: any) => setResidential(e.target.value)}/>
                </Form>
            </div>
            </>}
        </>
    );
}

export default ProgramDetails;