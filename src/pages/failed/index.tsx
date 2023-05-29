import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AuthContext from '../../context/auth-context';
import axios from 'axios';

interface PaymentDetails {
  cfLinkId: number;
  customerDetails: { customerPhone: string; customerEmail: string; customerName: string };
  linkAmount: number;
  linkAmountPaid: number;
  linkAutoReminders: boolean;
  linkCreatedAt: string;
  linkCurrency: string;
  linkExpiryTime: string;
  linkId: string;
  linkMeta: { upiIntent: string };
  linkMinimumPartialAmount: null;
  linkNotes: Record<string, never>;
  linkNotify: { sendSms: boolean; sendEmail: boolean };
  linkPartialPayments: boolean;
  linkPurpose: string;
  linkStatus: string;
  linkUrl: string;
}

const Failed: React.FC = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const bookingId = params.get('bookingid');
  const [linkId, setLinkId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();

  const routeChange = () => {
    const path = `/add_client`;
    history.push(path);
  };

  const config = {
    headers: { Authorization: `Bearer ${auth.token}` }
  };

  useEffect(() => {
    // Fetch data from GET API using the postId
    const fetchData = () => {
      axios
        .get(
          `${process.env.REACT_APP_URL}/api/client-booking/getpaymentlinksbylinkid/?link_id=link_id_${bookingId}`,
          config
        )
        .then((response) => {
          console.log(response.data.cfLink);
          setPaymentDetails(response.data.cfLink);
          setLinkId(response.data.cfLink.linkId);
        });
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center">
        <img src="/images/transaction/failed.png" alt="failed" />
      </div>
      <div className="d-flex justify-content-center align-item-center mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 24 24">
          <path
            fill="#B53737"
            d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 15.586l-1.414 1.414-4.586-4.586-4.586 4.586-1.414-1.414 4.586-4.586-4.586-4.586 1.414-1.414 4.586 4.586 4.586-4.586 1.414 1.414-4.586 4.586 4.586 4.586z"
          />
        </svg>
        <h1 className="text-danger ml-2 "> Oops!! Transaction Failed</h1>
      </div>

      <h4 className="text-center mt-4">Transaction failed for {linkId}</h4>
      <h6 className="text-center mt-2">
        <b>Link url:</b>{' '}
        <a href={paymentDetails?.linkUrl} style={{ color: 'black' }}>
          {paymentDetails?.linkUrl}
        </a>
      </h6>
      <div className="d-flex justify-content-center mt-4">
        <Button onClick={routeChange} variant="danger">
          Go back to client page
        </Button>
      </div>
    </>
  );
};

export default Failed;
