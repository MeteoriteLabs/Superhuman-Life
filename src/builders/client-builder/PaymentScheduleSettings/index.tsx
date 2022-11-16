import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { FETCH_CONTACT_DETAILS } from "./queries";
import { FETCH_USER_PROFILE_DATA } from "../../../pages/profile/queries/queries";
import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AllTransactions from "../AllTransactions/AllTransactions";
import PaymentSchedule from "../PaymentSchedule";
import PayeeProfile from "../PayeeProfile";
import PaymentMode from "../PaymentMode";

const PaymentScheduleSettings = () => {
  const [contactData, setContactData] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id: string | null = params.get("id");
  const isChangemaker: boolean = params.get("isChangemaker") === "true" ;

  // eslint-disable-next-line
  const [users, { data: get_changemakers }] = useLazyQuery(
    FETCH_USER_PROFILE_DATA,
    {
      onCompleted: (data) => {
        const flattenContactsData = flattenObj({ ...get_contacts.contact });
        const flattenUsersData = flattenObj({ ...data.usersPermissionsUser });

        setContactData(flattenContactsData);
        setUserData(flattenUsersData);
      },
    }
  );

  const { data: get_contacts } = useQuery(FETCH_CONTACT_DETAILS, {
    variables: { id: id },
    skip: !id,
    onCompleted: (r: any) => {
      //calling useLazyQuery function for FETCH_USER_PROFILE_DATA query
      users({ variables: { id: id } });
    },
  });

  return (
    <>
      {/* Contact details card */}
      <Card className="p-3">
        <div className="d-flex justify-content-between flex-wrap m-2">
          <div>
            <p>
              <b>Name </b>{" "}
              {!isChangemaker
                ? contactData.firstname
                : userData && userData && userData.First_Name}
            </p>
            <p>
              <b>Phone </b>{" "}
              {!isChangemaker
                ? contactData && contactData.phone
                : userData && userData.Last_Name}
            </p>
            <p>
              <b>Email </b>{" "}
              {!isChangemaker
                ? contactData && contactData.email
                : userData && userData.email}
            </p>
          </div>
          <div>
            <p>
              <b>Type of Payee</b>{" "}
              {contactData &&
              contactData.organisationDetails &&
              contactData.organisationDetails.organisationName
                ? "Organisation"
                : "Individual"}{" "}
            </p>
            {contactData &&
            contactData.organisationDetails &&
            contactData.organisationDetails.organisationName ? (
              <p>
                <b>Organisation Name</b>{" "}
                {contactData.organisationDetails.organisationName}{" "}
              </p>
            ) : null}
            {contactData &&
            contactData.organisationDetails &&
            contactData.organisationDetails.organisationName ? (
              <p>
                <b>GST Detail</b> {contactData.organisationDetails.gst}{" "}
              </p>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Navtabs */}
      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Tabs
            variant="pills"
            transition={false}
            defaultActiveKey="paymentschedule"
          >
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
            {!isChangemaker ? (
              <Tab eventKey="profile" title="Profile">
                <TabContent>
                  <hr />
                  <PayeeProfile />
                </TabContent>
              </Tab>
            ) : null}
            {!isChangemaker ? (
              <Tab eventKey="paymentmode" title="Payment Mode">
                <TabContent>
                  <hr />
                  <PaymentMode />
                </TabContent>
              </Tab>
            ) : null}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaymentScheduleSettings;
