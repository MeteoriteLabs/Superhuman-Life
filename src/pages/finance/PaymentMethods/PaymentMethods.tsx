import { Tabs, Tab } from "react-bootstrap";
import BankAccount from "./BankAccountDetails";
import UPI from "./UPIDetails";

export default function PaymentMethods() {
  return (
    <div>
      {/* <PaymentMethodsAction ref={paymentMethodActionRef} />

            <div className='d-flex justify-content-around' style={{ marginTop: '10rem' }}>
                <div className='text-center' style={{ cursor: 'pointer' }} onClick={() => {
                    paymentMethodActionRef.current.TriggerForm({ actionType: 'bank' })
                }}>
                    <div style={{ padding: '40px 100px', boxShadow: '0px 0px 14px 3px #D1D1D1' }}>
                        <img src="./assets/bank.svg" alt="bank" />
                        <p className='mt-4 font-weight-bold'>Bank Account</p>
                    </div>
                    <p className="mt-4">Last Update: 06/06/2021</p>
                </div>


                <div className='text-center' style={{ cursor: 'pointer' }} onClick={() => {
                    paymentMethodActionRef.current.TriggerForm({ actionType: 'upi' })
                }}>
                    <div style={{ padding: '50px 100px', boxShadow: '0px 0px 14px 3px #D1D1D1' }}>
                        <img src="./assets/upi.svg" alt="bank" />
                        <p className='mt-4 font-weight-bold'>UPI</p>
                    </div>
                    <p className="mt-4">Last Update: 06/06/2021</p>
                </div>
            </div> */}

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
