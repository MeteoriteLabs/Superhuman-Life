import { Tabs, Tab, Card } from "react-bootstrap";
import BankAccount from "./BankAccountDetails";
import UPI from "./UPIDetails";

export default function PaymentMethods() {
  return (
    <div>
      <Card className="shadow-sm mt-2" border="light">
        <Card.Body>
          <Tabs
            style={{ borderBottom: "1px solid black" }}
            className="pb-3"
            variant="pills"
            transition={false}
            defaultActiveKey="bankAccount"
          >
            <Tab eventKey="bankAccount" title="Bank Account">
              <BankAccount />
            </Tab>

            <Tab eventKey="upi" title="UPI">
              <UPI />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}
