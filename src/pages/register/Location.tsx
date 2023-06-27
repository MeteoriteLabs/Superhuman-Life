import { Form, Button } from 'react-bootstrap';

const LocationForm = (props: any) => {
    function successCallback(data) {
        console.log(data);
    }

    function failureCallback(error) {
        console.log(error);
    }

    return (
        <>
            <div>
                <Button
                    variant="info"
                    onClick={() =>
                        window.navigator.geolocation.getCurrentPosition(
                            successCallback,
                            failureCallback
                        )
                    }
                >
                    <i className="fas fa-search-location mr-2"></i>Use Current Location
                </Button>
            </div>
            <br />
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Address 1</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                            props.onChange(e.target.value);
                        }}
                        placeholder="enter address 1"
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control type="text" placeholder="enter address 2" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="eg: Mumbai" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" placeholder="eg: Maharashtra" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" placeholder="eg: India" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Zipcode</Form.Label>
                    <Form.Control type="number" placeholder="" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
            </Form>
        </>
    );
};

export default LocationForm;
