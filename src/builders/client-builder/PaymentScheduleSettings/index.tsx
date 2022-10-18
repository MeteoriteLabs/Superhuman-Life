import { useState } from 'react';
import { useQuery } from "@apollo/client";
import { FETCH_CONTACT_DETAILS } from "./queries";
import { Card, Row, Col } from 'react-bootstrap';
import { flattenObj } from "../../../components/utils/responseFlatten";

const PaymentScheduleSettings = () => {
  const [contactDetail, setContactDetail] = useState();
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get('id');
  console.log(id);

  const {data: getContactDetails} = useQuery(FETCH_CONTACT_DETAILS, {
    variables: { id: id },
    onCompleted: (r: any) => {
      console.log(r);
      const flattenContactData = flattenObj(r);
      console.log(flattenContactData);
    },
  });

  return (
    <>
      <Card>
        <Card.Body>
          <Row>
          {getContactDetails? getContactDetails.contact.data.attributes.firstname : null}
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default PaymentScheduleSettings;
