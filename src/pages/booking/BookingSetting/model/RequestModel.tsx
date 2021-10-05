import React, { useState } from 'react'
import { Button, Form, FormControl, Modal } from 'react-bootstrap';



export default function RequestModel(props) {
    const { render, setRender } = props;

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [state, setState] = useState<any>(
        {
            people: [
                {
                    'firstname': "Paul",
                    'id': "1"
                },
                {
                    'firstname': "Martin",
                    'id': "2"
                },
                {
                    'firstname': "Joseph",
                    'id': "3"
                },
                {
                    'firstname': "Gregor",
                    'id': "4"
                }
            ],
            peopleChecked: [
                {
                    'firstname': "Martin",
                    'id': "2"
                },
                {
                    'firstname': "Gregor",
                    'id': "4"
                }
            ],
            selectPeopleId: []
        }
    )


    const onSwitchAction = () => {
        setIsSwitchOn(!isSwitchOn);
    };


    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChange = (e) => {


    }

    const handleSelect = (person) => {
      
        const found = state.peopleChecked.find((element) => {
            return element.id === person.id;
        });

        if (found) {
            setState({
                people: [...state.people],
                peopleChecked: state.peopleChecked.filter(element => element.id !== person.id),
                selectPeopleId: state.selectPeopleId.filter(element => element !== person.id)
            })
        } else {
            setState({
                people: [...state.people],
                peopleChecked: [...state.peopleChecked, person],
                selectPeopleId: [...state.selectPeopleId, person.id],
            })
        }
    }

    console.log(state)

    return (
        <Modal
            show={render}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setRender(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Configure Data Requests
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form onSubmit={HandleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Confirmations</Form.Label>
                        <div className='d-flex'>
                            <p>Before Payment</p>
                            <Form.Switch
                                checked={!isSwitchOn}
                                className='mx-4'
                                onChange={onSwitchAction} />
                            <p>After Payment</p>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Data Requests will be sent to clients after acceptance of booking</Form.Label>

                        {state.people.map((person, index) => {
                            return <Form.Group key={index} className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check
                                    id={person.id}
                                    type="checkbox"
                                    label={person.firstname}
                                    checked={state.peopleChecked.some(({ id }) => id === person.id)}
                                    onChange={(e) => handleSelect(person)} />
                            </Form.Group>
                        })}

                        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" onChange={(e) => handleChange(e)} />
                        </Form.Group> */}


                    </Form.Group>




                    <Modal.Footer>
                        <Button type='submit' onClick={() => {
                            // setRender(false)
                        }}>Submit</Button>
                        <Button className="btn btn-danger" onClick={() => {
                            setRender(false)
                        }}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
