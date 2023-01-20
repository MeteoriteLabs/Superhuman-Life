import React, { useState, useEffect, useContext} from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import Geocode from "react-geocode";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng} from 'react-google-places-autocomplete';
import { useMutation } from '@apollo/client';
import { CREATE_ADDRESS } from '../../builders/package-builder/fitness/graphQL/mutations';
import authContext from '../../context/auth-context';

const AddFitnessAddressModal = (props: any) => {

     const auth = useContext(authContext);
     const [googleAddressShow, setGoogleAddressShow] = useState(false);
     const [address1, setAddress1] = useState('');
     const [city, setCity] = useState('');
     const [state, setState] = useState('');
     const [zip, setZip] = useState('');
     const [country, setCountry] = useState('');
     const [title, setTitle] = useState('');
     const [value, setValue] = useState<any>(null);

     const [createAddress] = useMutation(CREATE_ADDRESS, { onCompleted: (data: any) => {
          props.onHide();
     }});

     if(value !== null){
          geocodeByAddress(value.label)
               .then(results => getLatLng(results[0]))
               .then(({lat, lng}) => {
                    getAddressFromCoordinates(lat.toString(), lng.toString());
               }
          );
     }

     Geocode.setApiKey("AIzaSyDDvAlVrvbBYMW08BBosDFM_x2inY-XQ-w");
     Geocode.setLanguage("en");

     function getAddressFromCoordinates(lat: string, lng: string){
          Geocode.fromLatLng(lat, lng).then(
               (response) => {
                    const address = response.results[0].formatted_address;
                    let city, state, country, zip;
                    for (let i = 0; i < response.results[0].address_components.length; i++) {
                    for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                    switch (response.results[0].address_components[i].types[j]) {
                         case "locality":
                         city = response.results[0].address_components[i].long_name;
                         break;
                         case "administrative_area_level_1":
                         state = response.results[0].address_components[i].long_name;
                         break;
                         case "country":
                         country = response.results[0].address_components[i].long_name;
                         break;
                         case "postal_code":
                         zip = response.results[0].address_components[i].long_name;
                         break
                    }
                    }
                    }
                    setCity(city);
                    setState(state);
                    setZip(zip);
                    setCountry(country);
                    setAddress1(address);
               },
               (error) => {
                    console.error(error);
               }
          );
     }
     

     function getLocation() {
          if (!navigator.geolocation) {
               console.log('Geolocation API not supported by this browser.');
          } else {
               console.log('Checking location...');
               navigator.geolocation.getCurrentPosition(success, error);
          }
     }
     function success(position) {
          getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
     }

     function error() {
          console.log('Geolocation error!');
          setGoogleAddressShow(true);
     }

     useEffect(() => {
          getLocation();    
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);


     function handleDisable(){
          if(address1 !== '' && city !== '' && state !== '' && zip !== '' && country !== '' && title !== ''){
              return false;
          }else {
              return true;
          }
     }

     function handleAddressAdd(){
          createAddress({
               variables: {
                    address: address1,
                    city: city,
                    state: state,
                    zip: zip,
                    country: country,
                    title: title,
                    users_permissions_user: auth.userid
               }
          })
     } 

     return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add new Address
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    {!googleAddressShow && <Form.Control value={address1} onChange={(e) => setAddress1(e.target.value)} type="text" placeholder="" />}
                    {googleAddressShow && <GooglePlacesAutocomplete
                         apiKey='AIzaSyDDvAlVrvbBYMW08BBosDFM_x2inY-XQ-w'
                         selectProps={{
                              value,
                              onChange: (e: any) => {setValue(e); setAddress1(e.label);},
                         }}
                    />}
               </Form.Group>
               <Form.Group controlId="formBasicEmail">
                    <Form.Label>City</Form.Label>
                    <Form.Control value={city} onChange={(e) => setCity(e.target.value)} type="text" placeholder="" />
               </Form.Group>
               <Form.Group controlId="formBasicEmail">
                    <Form.Label>State</Form.Label>
                    <Form.Control value={state} onChange={(e) => setState(e.target.value)} type="text" placeholder="" />
               </Form.Group>
               <Form.Group controlId="formBasicEmail">
                    <Form.Label>Country</Form.Label>
                    <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} type="text" placeholder="" />
               </Form.Group>
               <Form.Group controlId="formBasicEmail">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control value={zip} onChange={(e) => setZip(e.target.value)} type="text" placeholder="" />
               </Form.Group>
               <Form.Group controlId="formBasicEmail">
                    <Form.Label>Address Title</Form.Label>
                    <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="" />
               </Form.Group>
               {handleDisable() && <span className='text-danger'>It is compulsory to fill all the fields</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={props.onHide}>Close</Button>
              <Button variant='outline-success' onClick={handleAddressAdd} disabled={handleDisable()}>Add</Button>
            </Modal.Footer>
          </Modal>
     );
};

export default AddFitnessAddressModal;