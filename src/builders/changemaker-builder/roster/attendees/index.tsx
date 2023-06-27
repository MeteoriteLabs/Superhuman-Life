import { useState, useRef } from 'react'
import { Col, Row, FormControl, InputGroup, Button, Dropdown } from 'react-bootstrap'
import './actionButton.css'
import { GET_PARTICULAR_CLIENT } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import AddFeedback from './feedback/addFeedback'

const RosterAttendees = () => {
    const [clients, setClients] = useState<any>([])
    const [searchInput, setSearchInput] = useState<any>('')
    const CreateFeedbackComponent = useRef<any>(null)

    useQuery(GET_PARTICULAR_CLIENT, {
        variables: {
            id: window.location.pathname.split('/').pop(),
            username: searchInput
        },
        onCompleted: (data) => {
            const flattenData = flattenObj({ ...data })
            setClients(flattenData.sessionsBookings)
        }
    })

    function handleIndexFormatting(index: number) {
        return (index + 1).toString().padStart(2, '0')
    }

    return (
        <>
            <div className="text-left shadow-lg p-4" style={{ borderRadius: '15px' }}>
                <Row>
                    <Col lg={6}>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="basic-addon1"
                                placeholder="Search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    onClick={(e: any) => {
                                        e.preventDefault()
                                    }}
                                >
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                {clients.length === 0 && (
                    <div className="text-center mt-3 text-info p-3 shadow-lg rounded border border-secondary">
                        <b>No Clients Available</b>
                    </div>
                )}
                {clients.length > 0 && (
                    <div className="mt-3">
                        {clients?.map((item: any, index: any) => {
                            return (
                                <>
                                    <div
                                        className="text-left shadow-lg"
                                        key={index}
                                        style={{ borderRadius: '15px' }}
                                    >
                                        <Row>
                                            <Col lg={4} style={{ borderRight: '2px dashed gray' }}>
                                                <div
                                                    className="pl-3 pt-1 pb-1"
                                                    style={{
                                                        backgroundColor: 'gray',
                                                        maxWidth: '50px',
                                                        borderTopLeftRadius: '15px',
                                                        borderBottomRightRadius: '15px'
                                                    }}
                                                >
                                                    <h6>{handleIndexFormatting(index)}</h6>
                                                </div>
                                                <div className="text-center">
                                                    <img
                                                        src="https://picsum.photos/200/100"
                                                        alt="profile-pic"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%'
                                                        }}
                                                    />
                                                    <h5>{item.client.username}</h5>
                                                    <span>
                                                        29 years | {item.client.Gender} | 174 cm |
                                                        80 kg
                                                    </span>
                                                    <br />
                                                    <br />
                                                    <img
                                                        src="/assets/phone_icon.svg"
                                                        alt="call-pic"
                                                        style={{ width: '45px', height: '45px' }}
                                                    />
                                                    <img
                                                        src="/assets/record_icon.svg"
                                                        alt="call-pic"
                                                        style={{ width: '45px', height: '45px' }}
                                                    />
                                                    <img
                                                        src="/assets/message_icon.svg"
                                                        alt="call-pic"
                                                        style={{ width: '45px', height: '45px' }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={4} style={{ borderRight: '2px dashed gray' }}>
                                                <div className="p-3 text-center">
                                                    <h5>Pre-Session</h5>
                                                </div>
                                                <h5>Notes: </h5>
                                                <div className="ml-3">
                                                    <span>
                                                        Lower back pain and sore leg muscles Lower
                                                        back pain and sore leg muscles.
                                                    </span>
                                                </div>
                                                <div
                                                    className="mt-3"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <h5>Mood: </h5>
                                                    <img
                                                        src="/assets/happy_icon.svg"
                                                        alt="call-pic"
                                                        style={{ width: '45px', height: '45px' }}
                                                    />
                                                </div>
                                                <div className="p-3 text-center">
                                                    <span style={{ color: 'gray' }}>
                                                        From Client
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col lg={4}>
                                                <div className="p-3">
                                                    <Row>
                                                        <Col
                                                            lg={10}
                                                            sm={10}
                                                            className="text-center"
                                                        >
                                                            <h5>Feedback</h5>
                                                        </Col>
                                                        <Col>
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    id="dropdown-basic"
                                                                    as="button"
                                                                    className="actionButtonDropDown"
                                                                >
                                                                    <i className="fas fa-ellipsis-v"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            CreateFeedbackComponent.current.TriggerForm(
                                                                                {
                                                                                    id: null,
                                                                                    type: 'create'
                                                                                }
                                                                            )
                                                                        }}
                                                                    >
                                                                        Add Feedback
                                                                    </Dropdown.Item>
                                                                    <AddFeedback
                                                                        ref={
                                                                            CreateFeedbackComponent
                                                                        }
                                                                    ></AddFeedback>
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            window.location.href = `/client/home/${item?.client?.id}`
                                                                        }}
                                                                    >
                                                                        Go to Client
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item>
                                                                        Add Pre-Session
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <h5>Feedback: </h5>
                                                <div className="ml-3">
                                                    <span>
                                                        Lorem Ipsum is simply dummy text of the
                                                        printing and typesetting industry. Lorem
                                                        Ipsum has been the industry&apos;s standard
                                                        dummy text ever since the 1500s
                                                    </span>
                                                </div>
                                                <div
                                                    className="mt-3"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <h5>Mood: </h5>
                                                    <span
                                                        className="ml-3"
                                                        style={{ color: 'green' }}
                                                    >
                                                        <b>Attended</b>
                                                    </span>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <span style={{ color: 'gray' }}>
                                                        From Changemaker
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default RosterAttendees
