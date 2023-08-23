import React, { useState, useContext, useEffect } from 'react';
import {
    GET_CLIENT_BOOKING,
    GET_OFFERING_INVENTORIES,
    CREATE_TRANSACTION,
    GET_TAG,
    UPDATE_TAG
} from './queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import DisplayImage from 'components/DisplayImage';
import { Button } from 'react-bootstrap';
import ClientDetailsCard from './ClientDetails';
import OfferingDetails from './OfferingDetails';
import { UPDATE_OFFERING_INVENTORY } from 'builders/package-builder/fitness/graphQL/mutations';
import AuthContext from 'context/auth-context';
import { UPDATE_BOOKING_STATUS } from '../booking/GraphQL/mutation';
import moment from 'moment';
import { CREATE_USER_PACKAGE } from '../booking/GraphQL/mutation';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './summary.css';
// import QRCode from 'react-qr-code';
import API_END_POINTS from 'components/utils/integration';
import { PackageDetails } from './Interface';
import { CREATE_TAG } from './queries';

interface PackagePricing {
    duration: number;
    foodPrice?: number;
    mrp: string;
    privateRoomPrice?: number;
    sapienPricing: number;
    suggestedPrice: number;
    threeSharingPrice?: number;
    twoSharingPrice?: number;
    voucher?: number;
}

interface UserPackageResponse {
    id: string;
    users_permissions_user: {
        id: string;
        username: string;
        __typename: string;
    };
    fitnesspackages: {
        id: string;
        packagename: string;
        __typename: string;
    }[];
    __typename: string;
}

const Summary: React.FC = () => {
    const auth = useContext(AuthContext);
    const [packageDetails, setPackageDetails] = useState<PackageDetails>({} as PackageDetails);
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const bookingId = params.get('id');
    const [linkId, setLinkId] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(600);
    const [isLinkSent, setIsLinkSent] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<string | null>(null);
    const [packagePricing, setPackagePricing] = useState<PackagePricing[]>([]);
    const [clientPackage, setClientPackage] = useState<UserPackageResponse>(
        {} as UserPackageResponse
    );

    const history = useHistory();

    const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
    };

    useQuery(GET_CLIENT_BOOKING, {
        variables: { id: Number(bookingId) },
        onCompleted: (response) => {
            const flattenBookingResponse: PackageDetails = flattenObj(response.clientBooking);

            setPackageDetails(flattenBookingResponse);
            setPackagePricing(flattenBookingResponse.fitnesspackages[0].fitnesspackagepricing);
        }
    });

    const mrp = packagePricing.find(
        (currentValue) => currentValue.duration === packageDetails.package_duration
    );

    const [getTag] = useLazyQuery(GET_TAG, {
        onCompleted: (tagsResponse) => {
            const flattenTagsResponse = flattenObj(tagsResponse.tags);

            updateTag({
                variables: {
                    id: Number(flattenTagsResponse[0].id),
                    data: {
                        client_packages: clientPackage.id
                    }
                },
                onCompleted: () => {
                    history.push(`/success/?bookingid=${bookingId}`);
                }
            });
        }
    });

    const [offeringInventory] = useLazyQuery(GET_OFFERING_INVENTORIES);
    const [createTransaction] = useMutation(CREATE_TRANSACTION);
    const [updateTag] = useMutation(UPDATE_TAG);
    const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY);
    const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS);
    const [createTag] = useMutation(CREATE_TAG);

    const [createUserPackage] = useMutation(CREATE_USER_PACKAGE, {
        onCompleted: (response) => {
            const flattenUserPackageResponse: UserPackageResponse = flattenObj(
                response.createClientPackage
            );

            setClientPackage(flattenUserPackageResponse);
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
                    if (
                        packageDetails.fitnesspackages[0].fitness_package_type.type !==
                            'On-Demand PT' &&
                        packageDetails.fitnesspackages[0].fitness_package_type.type !==
                            'Custom Fitness' &&
                        packageDetails.fitnesspackages[0].fitness_package_type.type !== 'One-On-One'
                    ) {
                        offeringInventory({
                            variables: {
                                changemaker_id: auth.userid,
                                fitnessPackage_id: packageDetails.fitnesspackages[0].id
                            },

                            onCompleted: (response) => {
                                const flattenOfferingInventories = flattenObj(
                                    response.offeringInventories
                                );

                                updateOfferingInventory({
                                    variables: {
                                        id: flattenOfferingInventories[0].id,
                                        data: {
                                            ActiveBookings:
                                                flattenOfferingInventories[0].ActiveBookings + 1,
                                            ClassAvailability:
                                                flattenOfferingInventories[0].ClassAvailability - 1,
                                            ClassAvailabilityUpdatedAt: moment().format(),
                                            ClientBookingDetails: [
                                                ...flattenOfferingInventories[0]
                                                    .ClientBookingDetails,
                                                {
                                                    ClientId:
                                                        packageDetails &&
                                                        packageDetails.ClientUser.length &&
                                                        packageDetails.ClientUser[0].id,
                                                    Duration:
                                                        packageDetails &&
                                                        packageDetails.package_duration,
                                                    Effective_Date:
                                                        packageDetails &&
                                                        packageDetails.effective_date,
                                                    ExpiryOfPackage: moment(
                                                        packageDetails &&
                                                            packageDetails.effective_date
                                                    ).add(
                                                        packageDetails &&
                                                            packageDetails.package_duration,
                                                        'days'
                                                    )
                                                }
                                            ]
                                        }
                                    },
                                    onCompleted: (response) => {
                                        const flattenInventoryResponse = flattenObj(
                                            response.updateOfferingInventory
                                        );

                                        getTag({
                                            variables: {
                                                fitnessPackageId:
                                                    flattenInventoryResponse.fitnesspackage.id
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        createTag({
                            variables: {
                                data: {
                                    tag_name:
                                        flattenUserPackageResponse.fitnesspackages &&
                                        flattenUserPackageResponse.fitnesspackages.length
                                            ? flattenUserPackageResponse.fitnesspackages[0]
                                                  .packagename
                                            : null,
                                    client_packages: flattenUserPackageResponse
                                        ? flattenUserPackageResponse.id
                                        : null,
                                    fitnesspackage:
                                        flattenUserPackageResponse.fitnesspackages &&
                                        flattenUserPackageResponse.fitnesspackages.length
                                            ? flattenUserPackageResponse.fitnesspackages[0].id
                                            : null
                                }
                            },

                            onCompleted: () => {
                                history.push(`/success/?bookingid=${bookingId}`);
                            }
                        });
                    }
                }
            });
        }
    });

    //Free package flow
    const completeBooking = () => {
        createUserPackage({
            variables: {
                data: {
                    PackageMRP: 0,
                    users_permissions_user: packageDetails.ClientUser[0].id,
                    fitnesspackages: packageDetails.fitnesspackages[0].id,
                    accepted_date: packageDetails.booking_date ? packageDetails.booking_date : null,
                    package_duration: packageDetails.package_duration,
                    effective_date: packageDetails.effective_date
                }
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
            axios
                .get(`${API_END_POINTS.paymentDetailsViaLink}${linkId}`, config)
                .then((response) => {
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
                                    TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].packagename} `
                                }
                            },
                            onCompleted: (transactionResponse) => {
                                const flattenTransactionResponse = flattenObj(
                                    transactionResponse.createTransaction
                                );

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
                                    }
                                });
                            }
                        });
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
                                    link_id: response.data.cfLink.linkId,
                                    TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].packagename} `
                                }
                            },
                            onCompleted: () => {
                                updateBookingStatus({
                                    variables: {
                                        id: bookingId,
                                        Booking_status: 'canceled',
                                        BookingID: `BK${
                                            packageDetails &&
                                            packageDetails.ClientUser &&
                                            packageDetails.ClientUser.length
                                                ? packageDetails.ClientUser[0].First_Name.substring(
                                                      0,
                                                      3
                                                  )
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
                                    link_id: response.data.cfLink.linkId,
                                    TransactionRemarks: `Purchased package from changemaker with booking id ${bookingId} and fitness package id ${packageDetails.fitnesspackages[0].packagename} `
                                }
                            },
                            onCompleted: () => {
                                updateBookingStatus({
                                    variables: {
                                        id: bookingId,
                                        Booking_status: 'canceled',
                                        BookingID: `BK${
                                            packageDetails &&
                                            packageDetails.ClientUser &&
                                            packageDetails.ClientUser.length
                                                ? packageDetails.ClientUser[0].First_Name.substring(
                                                      0,
                                                      3
                                                  )
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
        if (linkId) {
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
                                Please wait while transaction is happening . Please don&apos;t leave
                                this page or press back.
                            </h6>
                        </Col>
                    </Row>
                </div>
            ) : null}

            {/* Package Details , client details and offering details with checkout option */}
            {packageDetails && !isLinkSent ? (
                <Row>
                    {packageDetails.fitnesspackages &&
                        packageDetails.fitnesspackages.length &&
                        packageDetails.fitnesspackages[0].fitness_package_type?.type[0] !==
                            'Cohort' &&
                        packageDetails.fitnesspackages &&
                        packageDetails.fitnesspackages.length &&
                        packageDetails.fitnesspackages[0].fitness_package_type?.type[0] !==
                            'Classic Class'}
                    <Col lg={6} sm={12}>
                        {/* Package details */}
                        <Card className="rounded mt-5 d-flex preview__card p-3">
                            <Row>
                                <Col lg={12}>
                                    <DisplayImage
                                        imageName={
                                            packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length
                                                ? packageDetails.fitnesspackages.map((curr) =>
                                                      curr.Thumbnail_ID ? curr.Thumbnail_ID : ''
                                                  )[0]
                                                : ''
                                        }
                                        defaultImageUrl="/assets/placeholder.svg"
                                        imageCSS="rounded-lg w-100 h-10 img-fluid img-thumbnail"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12} sm={12} className="ml-1">
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {packageDetails.fitnesspackages &&
                                        packageDetails.fitnesspackages.length
                                            ? packageDetails.fitnesspackages.map(
                                                  (curr) => curr.packagename
                                              )
                                            : null}
                                    </p>
                                </Col>
                                <Col lg={6}>
                                    <p className="bg-secondary text-white rounded-pill text-center">
                                        {packageDetails.fitnesspackages &&
                                        packageDetails.fitnesspackages.length
                                            ? packageDetails.fitnesspackages.map(
                                                  (curr) => curr.level
                                              )
                                            : null}
                                    </p>
                                </Col>
                                <Col lg={12} sm={12} className="ml-1 d-flex">
                                    {packageDetails.fitnesspackages &&
                                    packageDetails.fitnesspackages.length
                                        ? packageDetails.fitnesspackages.map((curr) =>
                                              curr.address ? (
                                                  <>
                                                      <img
                                                          src="/assets/location.svg"
                                                          alt="location"
                                                          style={{ height: '1.5rem' }}
                                                      />
                                                      <p style={{ fontSize: '1rem' }}>
                                                          {curr.address.address1}
                                                      </p>
                                                  </>
                                              ) : null
                                          )
                                        : null}
                                </Col>
                            </Row>
                            {packageDetails.fitnesspackages &&
                            packageDetails.fitnesspackages.length &&
                            packageDetails.fitnesspackages.find(
                                (curr) => curr.fitness_package_type.type[0] === 'Classic Class'
                            ) ? null : (
                                <hr />
                            )}
                            <Row>
                                <Col lg={6} sm={6} className="ml-1 d-flex">
                                    <Row>
                                        <Col lg={12} sm={12}>
                                            {packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length &&
                                            packageDetails.fitnesspackages[0].fitness_package_type
                                                .type === 'Group Class' ? (
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
                                            {packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length &&
                                            packageDetails.fitnesspackages.find(
                                                (curr) =>
                                                    curr.fitness_package_type.type[0] ===
                                                    'Custom Fitness'
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
                                            {(packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages.find(
                                                    (curr) =>
                                                        curr.fitness_package_type.type[0] ===
                                                        'One-On-One'
                                                )) ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages.find(
                                                    (curr) =>
                                                        curr.fitness_package_type.type[0] ===
                                                        'On-Demand PT'
                                                )) ? (
                                                <>
                                                    <img
                                                        loading="lazy"
                                                        src={
                                                            '/assets/personal-training-offline.svg'
                                                        }
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
                                            {packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length &&
                                            packageDetails.fitnesspackages.find(
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
                                            {(packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages.find(
                                                    (curr) =>
                                                        curr.fitness_package_type.type ===
                                                        'One-On-One'
                                                )) ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages.find(
                                                    (curr) =>
                                                        curr.fitness_package_type.type ===
                                                        'On-Demand PT'
                                                )) ? (
                                                <div
                                                    className="d-flex "
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    <div className="px-2">
                                                        {packageDetails.fitnesspackages &&
                                                            packageDetails.fitnesspackages.length &&
                                                            packageDetails.fitnesspackages.map(
                                                                (curr) =>
                                                                    curr.ptoffline
                                                                        ? curr.ptoffline
                                                                        : 0
                                                            )}
                                                    </div>
                                                    <div className="px-3">
                                                        {packageDetails.fitnesspackages &&
                                                            packageDetails.fitnesspackages.length &&
                                                            packageDetails.fitnesspackages.map(
                                                                (curr) =>
                                                                    curr.ptonline
                                                                        ? curr.ptonline
                                                                        : 0
                                                            )}
                                                    </div>
                                                </div>
                                            ) : null}
                                            {packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length &&
                                            packageDetails.fitnesspackages[0].fitness_package_type
                                                .type === 'Group Class' ? (
                                                <div
                                                    className="d-flex "
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    <div className="px-2">
                                                        {packageDetails.fitnesspackages[0]
                                                            .groupoffline
                                                            ? packageDetails.fitnesspackages[0]
                                                                  .groupoffline
                                                            : 0}
                                                    </div>
                                                    <div className="px-3">
                                                        {packageDetails.fitnesspackages &&
                                                        packageDetails.fitnesspackages.length &&
                                                        packageDetails.fitnesspackages[0]
                                                            .grouponline
                                                            ? packageDetails.fitnesspackages &&
                                                              packageDetails.fitnesspackages
                                                                  .length &&
                                                              packageDetails.fitnesspackages[0]
                                                                  .grouponline
                                                            : 0}
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
                                    packageDetails.fitnesspackages[0].fitnesspackagepricing &&
                                    packageDetails.fitnesspackages[0].fitnesspackagepricing
                                        .length &&
                                    packageDetails.fitnesspackages[0].fitnesspackagepricing[0]
                                        .mrp === 'free' ? (
                                        <p>Free</p>
                                    ) : (
                                        <p style={{ fontSize: '1rem' }}>
                                            Rs.{' '}
                                            {(packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type ===
                                                    'On-Demand PT') ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type ===
                                                    'Classic Class') ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type === 'Cohort' &&
                                                packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitnesspackagepricing &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitnesspackagepricing.length)
                                                ? packageDetails.fitnesspackages[0].fitnesspackagepricing.filter(
                                                      (curr) => curr.duration === 1
                                                  )[0].mrp
                                                : null}
                                            {packageDetails.fitnesspackages &&
                                            packageDetails.fitnesspackages.length &&
                                            packageDetails.fitnesspackages[0].fitness_package_type
                                                .type === 'Event' &&
                                            packageDetails.fitnesspackages[0]
                                                .fitnesspackagepricing &&
                                            packageDetails.fitnesspackages[0].fitnesspackagepricing
                                                .length
                                                ? packageDetails.fitnesspackages[0]
                                                      .fitnesspackagepricing[0].mrp
                                                : null}
                                            {(packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type === 'One-On-One') ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type ===
                                                    'Custom Fitness') ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type === 'Group Class') ||
                                            (packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitness_package_type.type ===
                                                    'Live Stream Channel' &&
                                                packageDetails.fitnesspackages &&
                                                packageDetails.fitnesspackages.length &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitnesspackagepricing &&
                                                packageDetails.fitnesspackages[0]
                                                    .fitnesspackagepricing.length)
                                                ? `${
                                                      packageDetails.fitnesspackages[0].fitnesspackagepricing.filter(
                                                          (curr) => curr.duration === 30
                                                      )[0].mrp
                                                  } Monthly`
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
                                    packageDetails.fitnesspackages[0].fitnesspackagepricing
                                        .length &&
                                    packageDetails.fitnesspackages[0].fitnesspackagepricing[0]
                                        .mrp === 'free' ? (
                                        <Button className="mt-3" onClick={() => completeBooking()}>
                                            Complete Booking
                                        </Button>
                                    ) : !isLinkSent ? (
                                        <>
                                            {/* payment options *
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
                      </div> 
                      <div className="form-check form-check-inline">
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
                  </div>  */}
                                            <div>
                                                <Button
                                                    className="mt-3"
                                                    onClick={() => sendLink(bookingId)}
                                                >
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
