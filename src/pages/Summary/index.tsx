import React, { useState, Fragment, useContext } from 'react';
import { GET_CLIENT_BOOKING, GET_OFFERING_INVENTORIES } from './queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { flattenObj } from '../../components/utils/responseFlatten';
import { Card, Col, Row } from 'react-bootstrap';
import DisplayImage from '../../components/DisplayImage';
import { Button } from 'react-bootstrap';
import ClientDetailsCard from './ClientDetails';
import OfferingDetails from './OfferingDetails';
import { UPDATE_OFFERING_INVENTORY } from '../../builders/package-builder/fitness/graphQL/mutations';
import AuthContext from '../../context/auth-context';
import { UPDATE_BOOKING_STATUS } from '../booking/GraphQL/mutation';
import moment from 'moment';
import { CREATE_USER_PACKAGE } from '../booking/GraphQL/mutation';

const Summary: React.FC = () => {
  const auth = useContext(AuthContext);
  const [packageDetails, setPackageDetails] = useState<any>();
  const [paymentMode, setpaymentMode] = useState<string>('UPI');
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const bookingId = params.get('id');

  // eslint-disable-next-line
  const { data: get_client_booking } = useQuery(GET_CLIENT_BOOKING, {
    variables: { id: bookingId },
    onCompleted: (response) => {
      const flattenBookingResponse = flattenObj(response.clientBooking);
      setPackageDetails(flattenBookingResponse);
    }
  });

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
                    packageDetails && packageDetails.package_duration, 'days'
                  )
                  
                }
              ]
            }
          }
        });
      }
    }
  );

  const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY, {
    onCompleted: () => {
      window.open('/success', '_self');
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

  return (
    <Fragment>
      <div className="col-lg-12">
        <h2>Summary</h2>

        {/* Card */}
        {packageDetails ? (
          <Row>
            {packageDetails.fitnesspackages.map(
              (curr) =>
                curr.fitness_package_type?.type[0] !== 'Cohort' &&
                curr.fitness_package_type?.type[0] !== 'Classic Class'
            )}
            <Col lg={3} sm={12}>
              <Card className="rounded mt-5 d-flex preview__card p-3">
                <Row>
                  <Col lg={12}>
                    <DisplayImage
                      imageName={packageDetails.fitnesspackages.map((curr) =>
                        curr.Thumbnail_ID ? curr.Thumbnail_ID : ''
                      )}
                      defaultImageUrl="/assets/placeholder.svg"
                      imageCSS="rounded-lg w-100 h-30 img-fluid img-thumbnail"
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
                          (curr) => curr.fitness_package_type?.type === 'Cohort'
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
            <ClientDetailsCard Client={packageDetails.ClientUser} />
            <OfferingDetails Offering={packageDetails} />
          </Row>
        ) : null}
        {packageDetails &&
        packageDetails.fitnesspackages &&
        packageDetails.fitnesspackages.length &&
        packageDetails.fitnesspackages[0].fitnesspackagepricing.length &&
        packageDetails.fitnesspackages[0].fitnesspackagepricing[0].mrp === 'free' ? (
          <Button className="mt-3" onClick={() => completeBooking()}>
            Complete Booking
          </Button>
        ) : (
          <div className="mt-3 col-lg-11  border p-3 bg-white">
            <h3 className="mb-3">Proceed to checkout</h3>
            <input
              type="radio"
              name="paymentMode"
              value="UPI"
              id="upi"
              checked={paymentMode === 'UPI'}
              onChange={(e) => setpaymentMode(e.target.value)}
              className="m-1"
            />
            <label htmlFor="upi" className="mr-3">
              UPI
            </label>

            <input
              type="radio"
              name="paymentMode"
              value="Link"
              id="link"
              checked={paymentMode === 'Link'}
              onChange={(e) => setpaymentMode(e.target.value)}
              className="m-1"
            />
            <label htmlFor="link">Payment thru link</label>
            <br />
            <Button className="mt-3">Proceed to Payment</Button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Summary;
