import { Tabs, Tab } from "react-bootstrap";
import BankAccount from "./BankAccountDetails";
import UPI from "./UPIDetails";

export default function PaymentMethods() {
  return (
    <div>
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
    </div>
  );
}
