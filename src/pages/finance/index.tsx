import { Card, Tab, Tabs } from 'react-bootstrap';
// import General from "./General/General";
import Summary from './Summary/Summary';
import Earnings from './Earnings/Earnings';
import Expenses from './Outflow';
// import Invoices from "./Invoices/Invoices";
import Vouchers from './Vouchers/Vouchers';
// import PaymentMethods from './PaymentMethods/PaymentMethods';
// import Platform from "./Platform/Platform";
// import PricingAssist from './PricingAssist/PricingAssist';
import AllTransactions from './Transactions';
import Payee from './Payee/Payee';
import './finance.css';

export default function index(): JSX.Element {
    return (
        <div>
            <h2>Finance</h2>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs
                        style={{ borderBottom: '1px solid black' }}
                        className="pb-3 cards"
                        variant="pills"
                        transition={false}
                        defaultActiveKey="summary"
                    >
                        <Tab eventKey="summary" title="Summary">
                            <Summary />
                        </Tab>

                        <Tab eventKey="earnings" title="Earnings">
                            <Earnings />
                        </Tab>

                        <Tab eventKey="expenses" title="Expenses" className="mt-3">
                            <Card className="shadow-sm mt-2" border="light">
                                <Card.Body>
                                    <Tabs
                                        style={{ borderBottom: '1px solid black' }}
                                        className="pb-3 cards"
                                        transition={false}
                                        defaultActiveKey="expenses"
                                        variant="pills"
                                    >
                                        <Tab eventKey="expenses" title="Expenses">
                                            <Expenses />
                                        </Tab>
                                        <Tab eventKey="payee" title="Payee">
                                            <Payee />
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Tab>

                        <Tab eventKey="allTransactions" title="All Transactions">
                            <AllTransactions />
                        </Tab>

                        <Tab eventKey="vouchers" title="Vouchers">
                            <Vouchers />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}
