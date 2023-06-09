import React, { useState, useContext, useEffect, ChangeEvent } from 'react';
import { GET_CLIENT_BOOKING, GET_OFFERING_INVENTORIES, CREATE_TRANSACTION } from './queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { flattenObj } from '../../components/utils/responseFlatten';
import { Card, Col, Row, CardDeck } from 'react-bootstrap';
import DisplayImage from '../../components/DisplayImage';
import { Button } from 'react-bootstrap';
import ClientDetailsCard from './ClientDetails';
import OfferingDetails from './OfferingDetails';
import { UPDATE_OFFERING_INVENTORY } from '../../builders/package-builder/fitness/graphQL/mutations';
import AuthContext from '../../context/auth-context';
import { UPDATE_BOOKING_STATUS } from '../booking/GraphQL/mutation';
import moment from 'moment';
import { CREATE_USER_PACKAGE } from '../booking/GraphQL/mutation';
import axios, { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import './summary.css';
import QRCode from 'react-qr-code';
import API_END_POINTS from '../../components/utils/integration';
import { CreateOrderResponseData } from './interfaces';

console.log(API_END_POINTS.createPaymentLinkUrl, API_END_POINTS.generateUPIQRCodeUrl);
const createPaymentLinkUrl = `${process.env.REACT_APP_URL}/api/client-booking/paymentlink`;
const createOrderUrl = `${process.env.REACT_APP_URL}/api/client-booking/getpaymentdetailsbyorderid/?order_id=CFPay_t4tr5clhg16g_7eh80498vp`;
const generateUPIQRCodeUrl = `${process.env.REACT_APP_URL}/api/transaction/initiatepaymentviaupiqrcode/?payment_session_id=session_WzQk5Ij1yuFjufVd_B7TgQqFysFzkwsHROQWwRHJeq2qaGlo5phPY7K7Iz_ACsJMX85ePObb2Bc4JJxyWdZzp8YihAKZOG6fJItbeMXEjLeE`;

interface PackagePricing {
  mrp: string;
  classes: number;
  duration: number;
  sapienPricing: number;
  suggestedPrice: number;
  voucher: number;
}

const Summary: React.FC = () => {
  const auth = useContext(AuthContext);
  const [packageDetails, setPackageDetails] = useState<any>();
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const bookingId = params.get('id');
  const [linkId, setLinkId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(600);
  const [isLinkSent, setIsLinkSent] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [packagePricing, setPackagePricing] = useState<PackagePricing[]>([]);
  const [paymentOption, setPaymentOption] = useState<string>('paymentlink');
  const [qrCode, setQrCode] = useState<string|null>(null);
  const history = useHistory();

  const config = {
    headers: { Authorization: `Bearer ${auth.token}` }
  };

  // eslint-disable-next-line
  const { data: get_client_booking } = useQuery(GET_CLIENT_BOOKING, {
    variables: { id: bookingId },
    onCompleted: (response) => {
      const flattenBookingResponse = flattenObj(response.clientBooking);
      setPackageDetails(flattenBookingResponse);
      setPackagePricing(flattenBookingResponse.fitnesspackages[0].fitnesspackagepricing);

      const mrp = flattenBookingResponse.fitnesspackages[0].fitnesspackagepricing.find(
        (currentValue) => currentValue.duration === flattenBookingResponse.package_duration
      );

      //create order on cashfree
      axios
        .post(
          API_END_POINTS.createOrderUrl,
          {
            orderId: bookingId,
            currency: 'INR',
            amount: Number(mrp?.mrp),
            customerEmail: `${flattenBookingResponse.ClientUser[0].email}`,
            customerPhone: `${flattenBookingResponse.ClientUser[0].Phone_Number}`,
            customerName: `${flattenBookingResponse.ClientUser[0].First_Name} ${flattenBookingResponse.ClientUser[0].Last_Name}`,
            customerId: `${flattenBookingResponse.ClientUser[0].id}`
          },
          config
        )
        .then((response) => {
          console.log(response);
          axios
            .get(
              `${API_END_POINTS.generateUPIQRCodeUrl}${response.data.cfOrder.paymentSessionId}`,
              config
            )
            .then((response) => {
              console.log(response);
            });
        });
    }
  });
  console.log(packagePricing, packageDetails?.fitnesspackages[0].fitness_package_type.type);
  const mrp = packagePricing.find(
    (currentValue) => currentValue.duration === packageDetails.package_duration
  );

  // eslint-disable-next-line
  const [offeringInventory, { data: get_offering_inventories }] = useLazyQuery(
    GET_OFFERING_INVENTORIES,
    {
      onCompleted: (response) => {
        const flattenOfferingInventories = flattenObj(response.offeringInventories);

        updateOfferingInventory({
          variables: {
            id: flattenOfferingInventories[0].id,
            data: {
              ActiveBookings: flattenOfferingInventories[0].ActiveBookings + 1,
              ClassAvailability: flattenOfferingInventories[0].ClassAvailability - 1,
              ClassAvailabilityUpdatedAt: moment().format(),
              ClientBookingDetails: [
                ...flattenOfferingInventories[0].ClientBookingDetails,
                {
                  ClientId:
                    packageDetails &&
                    packageDetails.ClientUser.length &&
                    packageDetails.ClientUser[0].id,
                  Duration: packageDetails && packageDetails.package_duration,
                  Effective_Date: packageDetails && packageDetails.effective_date,
                  ExpiryOfPackage: moment(packageDetails && packageDetails.effective_date).add(
                    packageDetails && packageDetails.package_duration,
                    'days'
                  )
                }
              ]
            }
          }
        });
      }
    }
  );

  const [createTransaction] = useMutation(CREATE_TRANSACTION);

  const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY, {
    onCompleted: () => {
      history.push(`/success/?bookingid=${bookingId}`);
    }
  });

  const [createUserPackage] = useMutation(CREATE_USER_PACKAGE, {
    onCompleted: (response) => {
      const flattenUserPackageResponse = flattenObj(response.createClientPackage);
      offeringInventory({
        variables: {
          changemaker_id: auth.userid,
          fitnessPackage_id: flattenUserPackageResponse.fitnesspackages[0].id
        }
      });
    }
  });

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: (response) => {
      const flattenBookingResponse = flattenObj(response.updateClientBooking);

      createUserPackage({
        variables: {
          data: {
            users_permissions_user: flattenBookingResponse.ClientUser[0].id,
            fitnesspackages: flattenBookingResponse.fitnesspackages[0].id,
            accepted_date: flattenBookingResponse.booking_date,
            package_duration: flattenBookingResponse.package_duration,
            effective_date: flattenBookingResponse.effective_date,
            PackageMRP: 0
          }
        }
      });
    }
  });

  const completeBooking = () => {
    updateBookingStatus({
      variables: {
        id: bookingId,
        Booking_status: 'booked',
        BookingID: `BK${
          packageDetails && packageDetails.ClientUser && packageDetails.ClientUser.length
            ? packageDetails.ClientUser[0].First_Name.substring(0, 3)
            : null
        }${bookingId}`
      }
    });
  };

  const sendLink = (bookingId: string | null) => {
    axios
      .post(
        API_END_POINTS.createPaymentLinkUrl,
        {
          orderId: bookingId,
          currency: 'INR',
          amount: packageDetails?.fitnesspackages[0].fitness_package_type.type
            ? Number(packagePricing[0].mrp)
            : Number(mrp?.mrp),
          customerEmail: `${packageDetails.ClientUser[0].email}`,
          customerPhone: `${packageDetails.ClientUser[0].Phone_Number}`,
          customerName: `${packageDetails.ClientUser[0].First_Name} ${packageDetails.ClientUser[0].Last_Name}`,
          customerId: `${packageDetails.ClientUser[0].id}`
        },
        config
      )
      .then((response) => {
        startTimer();
        setLinkId(response.data.cfLink.linkId);
        setIsLinkSent(true);
      });
  };

  const proceedToPayment = () => {
    console.log(paymentOption)
    if(paymentOption === 'paymentlink'){
      console.log('inside payment link')
      sendLink(bookingId);
    } else if (paymentOption === 'qrcode'){
      console.log('inside qr code')
      createQrCode();
    }
  }

  const createQrCode = () => {
    createOrder();
  }

  const createOrder = () => {
    console.log(packageDetails)
    axios
      .post(
        API_END_POINTS.createOrderUrl,
        {
          orderId: bookingId,
          currency: 'INR',
          amount: Number(mrp?.mrp),
          customerEmail: `${packageDetails.ClientUser[0].email}`,
          customerPhone: `${packageDetails.ClientUser[0].Phone_Number}`,
          customerName: `${packageDetails.ClientUser[0].First_Name} ${packageDetails.ClientUser[0].Last_Name}`,
          customerId: `${packageDetails.ClientUser[0].id}`
        },
        config
      )
      .then((response: any) => {
        console.log(response.data);
        axios
      .get(
        `API_END_POINTS.generateUPIQRCodeUrl${response.data.cfOrder.paymentSessionId}`,
        
        config
      )
      .then((response: any) => {
        console.log(response.data.cfOrderPayResponse.data.payload.qrcode);
        setQrCode(response.cfOrderPayResponse.data.payload.qrcode);
      });
      });
  };

  // useEffect(() => {
  //   createOrder();
  // },[])

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Clear the countdown interval and redirect to failure when the timer reaches 0
    if (timer <= 0) {
      clearInterval(countdown);
      setRedirect(`/failure/?bookingid=${bookingId}`); // Redirect to failure page
    }

    // Clean up the countdown interval on component unmount
    return () => {
      clearInterval(countdown);
    };
  };

  useEffect(() => {
    // Fetch payment status data from GET API using the linkId
    const fetchData = () => {
      axios.get(`${API_END_POINTS.paymentDetailsViaLink}${linkId}`, config).then((response) => {
        if (response.data.cfLink.linkStatus === 'PAID') {
          createTransaction({
            variables: {
              data: {
                TransactionDateTime: moment().format(),
                Currency: 'INR',
                PaymentGateway: 'Cashfree',
                PaymentMode: 'Payment Link',
                ReceiverType: 'Changemaker',
                SenderType: 'Client',
                TransactionStatus: 'SUCCESS',
                ReceiverID: auth.userid,
                SenderID: packageDetails.ClientUser[0].id,
                TransactionAmount: response.data.cfLink.linkAmountPaid,
                link_id: response.data.cfLink.linkId,
                TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].id} `
              }
            },
            onCompleted: (transactionResponse) => {
              const flattenTransactionResponse = flattenObj(transactionResponse.createTransaction);

              createUserPackage({
                variables: {
                  data: {
                    users_permissions_user: packageDetails.ClientUser[0].id,
                    fitnesspackages: packageDetails.fitnesspackages[0].id,
                    accepted_date: packageDetails.booking_date,
                    package_duration: packageDetails.package_duration,
                    effective_date: packageDetails.effective_date,
                    PackageMRP: response.data.cfLink.linkAmountPaid,
                    TransactionID: `${flattenTransactionResponse.id}`
                  }
                },
                onCompleted: () => {
                  updateBookingStatus({
                    variables: {
                      id: bookingId,
                      Booking_status: 'booked',
                      BookingID: `BK${
                        packageDetails &&
                        packageDetails.ClientUser &&
                        packageDetails.ClientUser.length
                          ? packageDetails.ClientUser[0].First_Name.substring(0, 3)
                          : null
                      }${bookingId}`
                    },
                    onCompleted: () => {
                      offeringInventory({
                        variables: {
                          changemaker_id: auth.userid,
                          fitnessPackage_id: packageDetails.fitnesspackages[0].id
                        }
                      });
                    }
                  });
                }
              });
            }
          });

          setRedirect(`/success/?bookingid=${bookingId}`);
        } else if (response.data.cfLink.linkStatus === 'EXPIRED') {
          createTransaction({
            variables: {
              data: {
                Currency: 'INR',
                PaymentGateway: 'Cashfree',
                PaymentMode: 'Payment Link',
                ReceiverType: 'Changemaker',
                SenderType: 'Client',
                TransactionStatus: 'FAILED',
                ReceiverID: auth.userid,
                SenderID: packageDetails.ClientUser[0].id,
                TransactionAmount: response.data.cfLink.linkAmountPaid,
                TransactionRefrenceID: response.data.cfLink.linkId,
                TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].id} `
              }
            },
            onCompleted: () => {
              updateBookingStatus({
                variables: {
                  id: bookingId,
                  Booking_status: 'canceled',
                  BookingID: `BK${
                    packageDetails && packageDetails.ClientUser && packageDetails.ClientUser.length
                      ? packageDetails.ClientUser[0].First_Name.substring(0, 3)
                      : null
                  }${bookingId}`
                }
              });
            }
          });
          setRedirect(`/failure/?bookingid=${bookingId}`);
        } else if (response.data.cfLink.linkStatus === 'CANCELLED') {
          createTransaction({
            variables: {
              data: {
                Currency: 'INR',
                PaymentGateway: 'Cashfree',
                PaymentMode: 'Payment Link',
                ReceiverType: 'Changemaker',
                SenderType: 'Client',
                TransactionStatus: 'FAILED',
                ReceiverID: auth.userid,
                SenderID: packageDetails.ClientUser[0].id,
                TransactionAmount: response.data.cfLink.linkAmountPaid,
                TransactionRefrenceID: response.data.cfLink.linkId,
                TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].id} `
              }
            },
            onCompleted: () => {
              updateBookingStatus({
                variables: {
                  id: bookingId,
                  Booking_status: 'canceled',
                  BookingID: `BK${
                    packageDetails && packageDetails.ClientUser && packageDetails.ClientUser.length
                      ? packageDetails.ClientUser[0].First_Name.substring(0, 3)
                      : null
                  }${bookingId}`
                }
              });
            }
          });
          setRedirect(`/failure/?bookingid=${bookingId}`);
        } else {
          // Continue fetching data if not yet successful or failed
          setTimeout(fetchData, 5000); // Fetch data every 5 seconds
        }
      });
    };

    // Start fetching data if postId is available
    if (linkId && paymentOption === 'paymentlink') {
      fetchData();
    }
  }, [linkId]);

  // Redirect the user to the appropriate page
  if (redirect) {
    history.push(redirect);
  }

  // Calculate the percentage of time elapsed
  const elapsedPercentage = ((300 - timer) / 300) * 100;

  return (
    <div className="col-lg-12">
      <h2>Summary</h2>

    {paymentOption === 'qrcode' && qrCode ? <><h4 className='text-center'>Scan and pay via UPI QR Code</h4> 

      <div style={{ height: "auto", margin: "0 auto", maxWidth: 74, width: "200%" }}>
      <QRCode
      size={356}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={qrCode}
      // value={"/png;base64,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"}
      viewBox={`0 0 356 356`}
      />
      </div> </>: null}

      {/* Timer after link is sent */}
      {isLinkSent ? (
        <div className="timer-svg">
          <svg className="timer-circle" width="120" height="120">
            <circle className="timer-circle-bg" cx="60" cy="60" r="54" />
            <circle
              className="timer-circle-fill"
              cx="60"
              cy="60"
              r="54"
              strokeDasharray={`${elapsedPercentage}, 100`}
            />
          </svg>
          <div className="timer-text">
            {Math.floor(timer / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(timer % 60)
              .toString()
              .padStart(2, '0')}
          </div>
          <Row className="mt-3">
            <Col lg={12}>
              <h6>
                Please wait while transaction is happening . Please don&apos;t leave this page or
                press back.
              </h6>
            </Col>
          </Row>
        </div>
      ) : null}

      {/* Package Details , client details and offering details with checkout option */}
      {packageDetails && isLinkSent === false ? (
        <Row>
          {packageDetails.fitnesspackages.map(
            (curr) =>
              curr.fitness_package_type?.type[0] !== 'Cohort' &&
              curr.fitness_package_type?.type[0] !== 'Classic Class'
          )}
          <Col lg={6} sm={12}>
            {/* Package details */}
            <Card className="rounded mt-5 d-flex preview__card p-3">
              <Row>
                <Col lg={12}>
                  <DisplayImage
                    imageName={packageDetails.fitnesspackages.map((curr) =>
                      curr.Thumbnail_ID ? curr.Thumbnail_ID : ''
                    )}
                    defaultImageUrl="/assets/placeholder.svg"
                    imageCSS="rounded-lg w-100 h-10 img-fluid img-thumbnail"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12} sm={12} className="ml-1">
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {packageDetails.fitnesspackages.map((curr) => curr.packagename)}
                  </p>
                </Col>
                <Col lg={6}>
                  <p className="bg-secondary text-white rounded-pill text-center">
                    {packageDetails.fitnesspackages.map((curr) => curr.level)}
                  </p>
                </Col>
                <Col lg={12} sm={12} className="ml-1 d-flex">
                  {packageDetails.fitnesspackages.map((curr) =>
                    curr.address ? (
                      <>
                        <img
                          src="/assets/location.svg"
                          alt="location"
                          style={{ height: '1.5rem' }}
                        />
                        <p style={{ fontSize: '1rem' }}>{curr.address}</p>
                      </>
                    ) : null
                  )}
                </Col>
              </Row>
              {packageDetails.fitnesspackages.find(
                (curr) => curr.fitness_package_type.type[0] === 'Classic Class'
              ) ? null : (
                <hr />
              )}
              <Row>
                <Col lg={6} sm={6} className="ml-1 d-flex">
                  <Row>
                    <Col lg={12} sm={12}>
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type[0] === 'Group Class'
                      ) ? (
                        <>
                          <img
                            loading="lazy"
                            src={'/assets/Group-Offline.svg'}
                            alt="group-offline"
                            height={25}
                          />
                          +
                          <img
                            loading="lazy"
                            src="/assets/Group-Online.svg"
                            height={25}
                            alt="group-online"
                          />{' '}
                        </>
                      ) : null}
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type[0] === 'Custom Fitness'
                      ) ? (
                        <>
                          <img
                            loading="lazy"
                            src="/assets/personal-training-online.svg"
                            height={20}
                            alt="ptonline"
                          />
                          <img
                            loading="lazy"
                            src={'/assets/Group-Offline.svg'}
                            alt="group-offline"
                            height={20}
                          />
                          <img
                            loading="lazy"
                            src="/assets/Group-Online.svg"
                            height={20}
                            alt="group-online"
                          />
                          <img
                            loading="lazy"
                            src="/assets/offeringImages/classic-class-online.svg"
                            height={20}
                            alt="recorded"
                          />
                        </>
                      ) : null}
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type[0] === 'One-On-One'
                      ) ||
                      packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type[0] === 'On-Demand PT'
                      ) ? (
                        <>
                          <img
                            loading="lazy"
                            src={'/assets/personal-training-offline.svg'}
                            alt="pt-offline"
                            height={20}
                          />
                          +{' '}
                          <img
                            loading="lazy"
                            src="/assets/personal-training-online.svg"
                            height={20}
                            alt="ptonline"
                          />
                        </>
                      ) : null}
                      {packageDetails.fitnesspackages.find(
                        (curr) =>
                          curr.fitness_package_type?.type === 'Cohort' ||
                          curr.fitness_package_type?.type === 'Event'
                      ) ? (
                        <>
                          <img
                            loading="lazy"
                            src={'/assets/home.svg'}
                            alt="home"
                            height={20}
                            style={{ paddingRight: '2px' }}
                          />

                          <img
                            loading="lazy"
                            src="/assets/food.svg"
                            height={20}
                            alt="ptonline"
                            style={{ paddingLeft: '2px' }}
                          />
                        </>
                      ) : null}
                      <br />
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type
                      ) === 'One-On-One' ||
                      packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type
                      ) === 'On-Demand PT' ? (
                        <div className="d-flex " style={{ fontSize: '0.7rem' }}>
                          <div className="px-2">
                            {packageDetails.fitnesspackages.map((curr) =>
                              curr.ptoffline ? packageDetails.ptoffline : 0
                            )}
                          </div>
                          <div className="px-3">
                            {packageDetails.fitnesspackages.map((curr) =>
                              curr.ptonline ? packageDetails.ptonline : 0
                            )}
                          </div>
                        </div>
                      ) : null}
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type === 'Group Class'
                      ) ? (
                        <div className="d-flex " style={{ fontSize: '0.7rem' }}>
                          <div className="px-2">
                            {packageDetails.fitnesspackages.map((curr) =>
                              curr.groupoffline ? curr.groupoffline : 0
                            )}
                          </div>
                          <div className="px-3">
                            {packageDetails.fitnesspackages.map((curr) =>
                              curr.grouponline ? curr.grouponline : 0
                            )}
                          </div>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </Col>

                <Col lg={4} className="ml-1">
                  {packageDetails &&
                  packageDetails.fitnesspackages &&
                  packageDetails.fitnesspackages.length &&
                  packageDetails.fitnesspackages[0].fitnesspackagepricing.length &&
                  packageDetails.fitnesspackages[0].fitnesspackagepricing[0].mrp === 'free' ? (
                    <p>Free</p>
                  ) : (
                    <p style={{ fontSize: '1rem' }}>
                      Rs.{' '}
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type?.type === 'On-Demand PT'
                      ) ||
                        packageDetails.fitnesspackages.find(
                          (curr) => curr.fitness_package_type?.type === 'Classic Class'
                        ) ||
                        (packageDetails.fitnesspackages.find(
                          (curr) => curr.fitness_package_type?.type === 'Cohort'
                        ) &&
                          packageDetails.fitnesspackages.map((curr) =>
                            curr.fitnesspackagepricing && curr.fitnesspackagepricing.length
                              ? curr.fitnesspackagepricing.find((curr) => curr.duration === 1).mrp
                              : null
                          ))}
                      {packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type?.type === 'Event'
                      ) &&
                        packageDetails.fitnesspackages.map((curr) =>
                          curr.fitnesspackagepricing && curr.fitnesspackagepricing.length
                            ? curr.fitnesspackagepricing.find((curr) => curr.duration === 0).mrp
                            : null
                        )}
                      {(packageDetails.fitnesspackages.find(
                        (curr) => curr.fitness_package_type.type === 'One-On-One'
                      ) ||
                        packageDetails.fitnesspackages.find(
                          (curr) => curr.fitness_package_type.type === 'Custom Fitness'
                        ) ||
                        packageDetails.fitnesspackages.find(
                          (curr) => curr.fitness_package_type.type === 'Group Class'
                        ) ||
                        packageDetails.fitnesspackages.find(
                          (curr) => curr.fitness_package_type.type === 'Live Stream Channel'
                        )) &&
                      packageDetails.fitnesspackages.map((curr) => curr.fitnesspackagepricing) &&
                      packageDetails.fitnesspackages.map(
                        (curr) => curr.fitnesspackagepricing.length
                      )
                        ? `${packageDetails.fitnesspackages.map(
                            (curr) =>
                              curr.fitnesspackagepricing.find((curr) => curr.duration === 30).mrp
                          )} Monthly`
                        : null}
                    </p>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>

          <Col lg={6}>
            <CardDeck className="d-flex flex-column mt-5">
              {/* Client details */}
              <ClientDetailsCard Client={packageDetails.ClientUser} />

              {/* offering details */}
              <OfferingDetails Offering={packageDetails} />

              {/* proceed to payment */}
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>Proceed to Payment</Card.Title>
                  {/* For free package complete booking option and for paid send payment link option */}
                  {packageDetails &&
                  packageDetails.fitnesspackages &&
                  packageDetails.fitnesspackages.length &&
                  packageDetails.fitnesspackages[0].fitnesspackagepricing.length &&
                  packageDetails.fitnesspackages[0].fitnesspackagepricing[0].mrp === 'free' ? (
                    <Button className="mt-3" onClick={() => completeBooking()}>
                      Complete Booking
                    </Button>
                  ) : isLinkSent === false ? (
                    <>
                    {/* payment options */}
                      {/* <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio1"
                          value='paymentlink'
                          onChange={() => setPaymentOption('paymentlink')}
                          onSelect={(e: ChangeEvent<HTMLInputElement>) => {setPaymentOption('paymentlink'); console.log(e.target.value)} }
                          defaultChecked={paymentOption === 'paymentlink'}
                        />
                        <label className="form-check-label" htmlFor="paymentlink">
                          Send payment link
                        </label>
                      </div> */}
                      {/* <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio2"
                          value="qrcode"
                          onChange={() => setPaymentOption('qrcode')}
                          onSelect={(e: ChangeEvent<HTMLInputElement>) => {setPaymentOption('qrcode'); console.log(e.target.value)} }
                          defaultChecked={paymentOption === 'qrcode'}
                        />
                        <label className="form-check-label" htmlFor="qrcode">
                          Pay via UPI QR Code
                        </label>
                      </div> */}
                      <div>
                        <Button className="mt-3" onClick={() => sendLink(bookingId)}>
                          {/* Proceed to payment */}
                          Send payment link
                        </Button>
                      </div>
                    </>
                  ) : null}
                </Card.Body>
              </Card>
            </CardDeck>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};

export default Summary;
