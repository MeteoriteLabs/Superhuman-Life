const API_END_POINTS = {
    createPaymentLinkUrl: `${process.env.REACT_APP_URL}/api/client-booking/paymentlink`, // Create payment link
    createOrderUrl:  `${process.env.REACT_APP_URL}/api/client-booking/pretransaction`, // create order using booking id on cashfree to get payment session id, cfOrderId, order status
    generateUPIQRCodeUrl: `${process.env.REACT_APP_URL}/api/transaction/initiatepaymentviaupiqrcode/?payment_session_id=`, // get UPI QR Code
    paymentDetailsViaLink: `${process.env.REACT_APP_URL}/api/client-booking/getpaymentlinksbylinkid/?link_id=`, // get payment details using payment link id  
    googleGeoCodeValidation: `https://maps.googleapis.com/maps/api/geocode/json`
};
  
export default API_END_POINTS;