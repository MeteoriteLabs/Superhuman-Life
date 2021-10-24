import React from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import General from "./General/General";
import Invoices from "./Invoices/Invoices";
import Vouchers from "./Vouchers/Vouchers";
import PaymentMethods from "./PaymentMethods/PaymentMethods";
import Platform from "./Platform/Platform";
import PricingAssist from "./PricingAssist/PricingAssist";

export default function index() {
    return (
        <div>
            <h1>Finance</h1>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs style={{ borderBottom: "1px solid black" }} className="pb-3" variant="pills" transition={false} defaultActiveKey="general">
                        <Tab eventKey="general" title="General">
                            <General />
                        </Tab>
                        <Tab eventKey="pricingAssist" title="Pricing Assist">
                            <PricingAssist />
                        </Tab>
                        <Tab eventKey="invoices" title="Invoices">
                            <Invoices />
                        </Tab>
                        <Tab eventKey="vouchers" title="Vouchers">
                            <Vouchers />
                        </Tab>

                        <Tab eventKey="platform" title="Platform">
                            <Platform />
                        </Tab>

                        <Tab eventKey="paymentMethods" title="Payment Methods">
                            <PaymentMethods />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
