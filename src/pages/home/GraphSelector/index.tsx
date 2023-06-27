import { Dropdown, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import LeadGraph from '../LeadGraph/index';
import ClientsGraph from '../ClientsGraph';
import SalesGraph from '../SalesGraph';
import OfferingBookingGraph from '../OfferingBookingGraph';

function GraphSelector() {
    const [isSales, setIsSales] = useState<boolean>(false);
    const [isLeads, setIsLeads] = useState<boolean>(true);
    const [isClients, setIsClients] = useState<boolean>(false);
    const [isOfferingBooking, setIsOfferingBooking] = useState<boolean>(false);
    const [label, setLabel] = useState<string>('Leads');

    return (
        <div className="bg-white rounded shadow">
            <Row>
                <Col md={{ offset: '10', span: '1' }}>
                    <Dropdown className="m-3">
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            {label}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    setIsLeads(false);
                                    setIsSales(true);
                                    setIsClients(false);
                                    setIsOfferingBooking(false);
                                    setLabel('Sales');
                                }}
                            >
                                Sales
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setIsLeads(true);
                                    setIsOfferingBooking(false);
                                    setIsSales(false);
                                    setIsClients(false);
                                    setLabel('Leads');
                                }}
                            >
                                Leads
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setIsLeads(false);
                                    setIsClients(true);
                                    setIsOfferingBooking(false);
                                    setIsSales(false);
                                    setLabel('Clients');
                                }}
                            >
                                Clients
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setIsLeads(false);
                                    setIsOfferingBooking(true);
                                    setIsSales(false);
                                    setIsClients(false);
                                    setLabel('Offering Bookings');
                                }}
                            >
                                Offering Bookings
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            {isSales ? <SalesGraph /> : null}
            {isLeads ? <LeadGraph /> : null}
            {isClients ? <ClientsGraph /> : null}
            {isOfferingBooking ? <OfferingBookingGraph /> : null}
        </div>
    );
}

export default GraphSelector;
