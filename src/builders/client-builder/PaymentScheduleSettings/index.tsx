import { useState } from 'react';
import { useQuery } from "@apollo/client";
import { FETCH_CONTACT_DETAILS } from "./queries";
import { Card, Tab, Tabs, TabContent } from 'react-bootstrap';
import { flattenObj } from "../../../components/utils/responseFlatten";
import AllTransactions from '../AllTransactions/AllTransactions';
import PaymentSchedule from '../PaymentSchedule';
import PayeeProfile from '../PayeeProfile';
import PaymentMode from '../PaymentMode';

const PaymentScheduleSettings = () => {
  const [contactData, setContactData] = useState<any>({});
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get('id');

  useQuery(FETCH_CONTACT_DETAILS,
    {
      variables: { id: id },
      onCompleted: (r: any) => {
        let flattenDetail = flattenObj(r);
        setContactData(flattenDetail.contact);
      },
    });

  return (
    <>
      {/* Contact details card */}
      <Card className="p-3">
        <div className='d-flex justify-content-between flex-wrap m-2'>
          <div>
            <p><b>Name  </b> {contactData ? contactData.firstname : null}</p>
            <p><b>Phone </b> {contactData ? contactData.email : null}</p>
            <p><b>Email </b> {contactData ? contactData.phone : null}</p>
          </div>
          <div>
            <p><b>Type of Payee</b> {contactData && contactData.organisationDetails ? 'Organisation' : 'Individual'} </p>
            {contactData && contactData.organisationDetails ? <p><b>Organisation Name</b> {contactData.organisationDetails.organisationName} </p> : null}
            {contactData && contactData.organisationDetails ? <p><b>GST Detail</b> {contactData.organisationDetails.gst} </p> : null}
          </div>
        </div>
      </Card>

      {/* Navtabs */}
      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Tabs variant="pills" transition={false} defaultActiveKey="paymentschedule">
            <Tab eventKey="paymentschedule" title="Payment Schedule">
              <TabContent>
                <hr />
                <PaymentSchedule />
              </TabContent>
            </Tab>
            <Tab eventKey="transactions" title="All Transactions">
              <TabContent>
                <hr />
                <AllTransactions />
              </TabContent>
            </Tab>
            <Tab eventKey="profile" title="Profile">
            <TabContent>
              <hr />
              <PayeeProfile />
            </TabContent>
          </Tab>
          <Tab eventKey="paymentmode" title="Payment Mode">
            <TabContent>
              <hr />
              <PaymentMode />
            </TabContent>
          </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>

  )
}

export default PaymentScheduleSettings;
