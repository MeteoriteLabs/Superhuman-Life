import React from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
// import General from "./General/General";
import Summary from "./Summary/Summary";
import Inflow from "./Inflow/Inflow";
import Outflow from "./Outflow/Outflow";
// import Invoices from "./Invoices/Invoices";
import Vouchers from "./Vouchers/Vouchers";
import PaymentMethods from "./PaymentMethods/PaymentMethods";
// import Platform from "./Platform/Platform";
import PricingAssist from "./PricingAssist/PricingAssist";
import AllTransactions from "./AllTransactions/AllTransactions";

export default function index() {
    return (
        <div>
            <h1>Finance</h1>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs style={{ borderBottom: "1px solid black" }} className="pb-3" variant="pills" transition={false} defaultActiveKey="general">
                        
                        <Tab eventKey="summary" title="Summary">
                            <Summary />
                        </Tab>

                        <Tab eventKey="inflow" title="Inflow">
                            <Inflow />
                        </Tab>

                        <Tab eventKey="outflow" title="Outflow">
                            <Outflow />
                        </Tab>

                        <Tab eventKey="allTransactions" title="All Transactions">
                            <AllTransactions />
                        </Tab>
                       
                        <Tab eventKey="vouchers" title="Vouchers">
                            <Vouchers />
                        </Tab>

                        <Tab eventKey="pricingAssist" title="Base Price">
                            <PricingAssist />
                        </Tab>

                        <Tab eventKey="paymentMethods" title="Payment Methods">
                            <PaymentMethods />
                        </Tab>

                         {/* <Tab eventKey="invoices" title="Invoices">
                            <Invoices />
                        </Tab> */}

                        {/* <Tab eventKey="platform" title="Platform">
                            <Platform />
                        </Tab> */}
                        
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
