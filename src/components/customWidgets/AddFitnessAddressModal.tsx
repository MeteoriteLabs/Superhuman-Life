import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import Geocode from "react-geocode";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { useMutation } from "@apollo/client";
import { CREATE_ADDRESS } from "../../builders/package-builder/fitness/graphQL/mutations";
import authContext from "../../context/auth-context";
import axios from 'axios';

const AddFitnessAddressModal: React.FC<{onHide: () => void; show: boolean;}> = ({onHide, show}) => {
  const auth = useContext(authContext);
  const [googleAddressShow, setGoogleAddressShow] = useState<boolean>(false);
  const [address1, setAddress1] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<any>(null);
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [errors, setErrors] = useState<string>('');

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: () => {
      onHide();
      setAddress1("");
      setCity("");
      setCountry("");
      setZip("");
      setTitle("");
      setValue("");
    },
  });

  if (value) {
    geocodeByAddress(value.label)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        getAddressFromCoordinates(lat.toString(), lng.toString());
      });
  }

  // Geocode.setApiKey("AIzaSyDDvAlVrvbBYMW08BBosDFM_x2inY-XQ-w");
  // Geocode.setLanguage("en");

  function getAddressFromCoordinates(lat: string, lng: string) {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country, zip;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
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
                break;
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
      console.log("Geolocation API not supported by this browser.");
    } else {
      console.log("Checking location...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  function success(position) {
    setLatitude((position.coords.latitude).toString());
    setLongitude((position.coords.longitude).toString());
    getAddressFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
  }

  function error() {
    console.log("Geolocation error!");
    setGoogleAddressShow(true);
  }

  useEffect(() => {
    getLocation();
  }, []);

  function handleDisable() {
    if (
      address1 !== "" &&
      city !== "" &&
      state !== "" &&
      zip !== "" &&
      country !== "" &&
      title !== ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  function handleAddressAdd() {
    validateAddress();
    // createAddress({
    //   variables: {
    //     address: address1,
    //     city: city,
    //     state: state,
    //     zip: zip,
    //     country: country,
    //     title: title,
    //     users_permissions_user: auth.userid,
    //     longitude: longitude,
    //     latitude: latitude
    //   },
    // });
  }

  const validateAddress = async () => {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address: `${address1},${city},${state},${country}`,
            key: 'AIzaSyCPFfbr4BbmFZL_vUhfSL-Kw7WG8x7V-8c',
          },
        }
      );

      const { status, results } = response.data;

      if (status === 'OK' && results.length > 0) {
        // Valid address
        createAddress({
          variables: {
            address: address1,
            city: city,
            state: state,
            zip: zip,
            country: country,
            title: title,
            users_permissions_user: auth.userid,
            longitude: longitude,
            latitude: latitude
          },
        });
        setErrors('');
        // Proceed with further actions, such as displaying the map
      } else {
        // Invalid address
        setErrors('Invalid address, Please enter correct address');
      }
    } catch (error) {
      // Handle error
      console.log('Error occurred:', error);
    }
  };

  return (
    <Modal
      show={show} 
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
          {!googleAddressShow && (
            <Form.Control
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              type="text"
              placeholder=""
            />
          )}
          {googleAddressShow && (
            <GooglePlacesAutocomplete
              apiKey="AIzaSyDDvAlVrvbBYMW08BBosDFM_x2inY-XQ-w"
              selectProps={{
                value,
                onChange: (e: any) => {
                  setValue(e);
                  setAddress1(e.label);
                },
              }}
            />
          )}
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>City</Form.Label>
          <Form.Control
            value={city}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>State</Form.Label>
          <Form.Control
            value={state}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Country</Form.Label>
          <Form.Control
            value={country}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Zip</Form.Label>
          <Form.Control
            value={zip}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setZip(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Address Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        {handleDisable() && (
          <span className="text-danger">
            It is compulsory to fill all the fields
          </span>
        )}
      </Modal.Body>
      {
        errors ? <p className="ml-3 text-danger">{errors}</p> : null
      }
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="outline-success"
          onClick={handleAddressAdd}
          disabled={handleDisable()}
        >
          Add
        </Button>
      </Modal.Footer>
      
    </Modal>
  );
};

export default AddFitnessAddressModal;
