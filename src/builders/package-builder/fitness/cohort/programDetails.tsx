import React, {useState, useContext} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';

const ProgramDetails = (props) => {

    const inputDisabled = props.readonly;

    console.log(props.formContext.classSize);
    const cohortClassSize = props.formContext.classSize;
    const existingData = props.value === undefined ? undefined : JSON.parse(props.value);
    console.log(existingData);
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

    const [showPrivate, setShowPrivate] = useState(props.value === undefined ? false : existingData.accomodationDetails?.private);
    const [showSharing, setShowSharing] = useState(props.value === undefined ? false : existingData.accomodationDetails?.sharing);
    const [privateRooms, setPrivateRooms] = useState<number>(props.value === undefined ? null : existingData.accomodationDetails?.privateRooms);
    const [twoSharing, setTwoSharing] = useState<number>(props.value === undefined ? null : existingData.accomodationDetails?.twoSharingRooms);
    const [threeSharing, setThreeSharing] = useState<number>(props.value === undefined ? null : existingData.accomodationDetails?.threeSharingRooms);
    const [foodDescription, setFoodDescription] = useState<string>(props.value === undefined ? "" : existingData.accomodationDetails?.foodDescription === undefined ? "" : existingData.accomodationDetails?.foodDescription);
    const [accomodationDetails] = useState<any>({});

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

    function calculateAccomodation({onePerRoom= 0,twoPerRoom= 0, threePerRoom= 0}: {onePerRoom?: number,twoPerRoom?: number, threePerRoom?: number}): boolean {
        if(onePerRoom + (2 * twoPerRoom) + (3 * threePerRoom) <= cohortClassSize){
            return true;
        }else {
            return false;
        }
    }

    function handleValidation(){
        if(mode === "0"){
            return true;
        }
        if(mode === "1"){
            if((addressTitle === "At My Address" && singleSelections.length !== 0) || addressTitle === "At Client Address"){
                return true;
            }
        }
        if(mode === "2" ){
            if((addressTitle === "At My Address" && singleSelections.length !== 0 && residential !== "") || (mode === "2" && addressTitle === "At Client Address")){
                if(!showPrivate && !showSharing){
                    return false;
                }
                if(foodDescription === "" && residential === "1"){
                    return false;
                }
                if(showPrivate && privateRooms! > 0 && !showSharing){
                    if(calculateAccomodation({onePerRoom: privateRooms,twoPerRoom: twoSharing,threePerRoom: threeSharing})){
                        return true;
                    }
                }
                if(showSharing && !showPrivate && (twoSharing! > 0 || threeSharing! > 0)){
                    if(calculateAccomodation({onePerRoom: privateRooms,twoPerRoom: twoSharing,threePerRoom: threeSharing})){
                        return true;
                    }
                }
                if(showPrivate && showSharing && privateRooms! > 0 && (twoSharing! > 0 || threeSharing! > 0)){
                    if(calculateAccomodation({onePerRoom: privateRooms,twoPerRoom: twoSharing,threePerRoom: threeSharing})){
                        return true;
                    }
                }
            }   
        }
    }

    accomodationDetails.private = showPrivate;
    accomodationDetails.sharing = showSharing;
    accomodationDetails.privateRooms = (showPrivate && privateRooms) || null;
    accomodationDetails.twoSharingRooms = (showSharing && twoSharing) || null;
    accomodationDetails.threeSharingRooms = (showSharing && threeSharing) || null;
    accomodationDetails.foodDescription = foodDescription;

    if(handleValidation()){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential, accomodationDetails: accomodationDetails}));
    }else {
        props.onChange(undefined)
    }



    // useEffect(() => {
        accomodationDetails.private = showPrivate;
        accomodationDetails.sharing = showSharing;
        accomodationDetails.privateRooms = privateRooms;
        accomodationDetails.twoSharingRooms = twoSharing;
        accomodationDetails.threeSharingRooms = threeSharing;
        accomodationDetails.foodDescription = foodDescription;
    // }, [showPrivate, privateRooms, foodDescription, showSharing, twoSharing, threeSharing, accomodationDetails]);

    console.log(accomodationDetails);

    if(handleValidation()){
        props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential, accomodationDetails: accomodationDetails}));
    }else {
        props.onChange(undefined)
    }
    // else if(mode === "1" && addressTitle === "At My Address" && singleSelections.length !== 0){
    //     props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    // }else if(mode === "2" && addressTitle === "At My Address" && singleSelections.length !== 0 && residential !== ""){
    //     props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    // }else if(mode === "1" && addressTitle === "At Client Address"){
    //     props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    // }else if(mode === "2" && addressTitle === "At Client Address"){
    //     props.onChange(JSON.stringify({addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}));
    // }

    console.log(twoSharing);

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
            {residential !== "" && mode === "2" && <div className='mt-3'>
            <Form.Check 
                custom
                inline
                type='checkbox'
                id={`custom-checkbox`}
                label="Private Rooms"
                checked={showPrivate}
                disabled={inputDisabled}
                onChange={() =>  {
                    setShowPrivate(!showPrivate);
                }}
            />
            <Form.Check 
                custom
                inline
                type='checkbox'
                id={`custom-checkbox2`}
                label="Sharing"
                checked={showSharing}
                disabled={inputDisabled}
                onChange={() =>  {
                    setShowSharing(!showSharing);
                }}
            />
            </div>}
            {showPrivate && mode === "2" && <div className='mt-3'>
                <label><b>Private Rooms</b></label>
                <Form.Group controlId="formBasicEmail-1">
                    <Form.Control type="number" disabled={inputDisabled} value={privateRooms} min={0} onChange={(e: any) => setPrivateRooms(parseInt(e.target.value))} />
                </Form.Group>    
            </div>}
            {showSharing && mode === "2" && <div>
                <label><b>Sharing Rooms</b></label>
                <Row>
                    <Col>
                        <Form.Group controlId="formBasicEmail-2">
                            <Form.Label>Dual Occupancy</Form.Label>
                            <Form.Control disabled={inputDisabled} type="number" min={0} value={twoSharing} onChange={(e: any) => {setTwoSharing(parseInt(e.target.value))}} />
                        </Form.Group> 
                        <span className='small text-muted'>Dual Occupancy as One room will be shared by 2 participants</span>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicEmail-3">
                            <Form.Label>Triple  Occupancy</Form.Label>
                            <Form.Control disabled={inputDisabled} type="number" min={0} value={threeSharing} onChange={(e: any) => setThreeSharing(parseInt(e.target.value))} />
                        </Form.Group>
                        <span className='small text-muted'>Triple Occupancy as One room will be shared by 3 participants</span> 
                    </Col>       
                </Row>   
            </div>}
            {residential === "1" && mode === "2" && <div>
                <label><b>Food Description</b></label>
                <Form.Group controlId="formBasictext">
                    <Form.Control as="textarea" disabled={inputDisabled} aria-label="With textarea" value={foodDescription} onChange={(e: any) => {
                        setFoodDescription(e.target.value)
                    }} />
                </Form.Group>    
            </div>}
        </>}
        </>
    );
}

export default ProgramDetails;