import React, { useEffect, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../../context/auth-context'
import { GET_CLIENT_BOOKING } from '../Summary/queries'
import { flattenObj } from '../../components/utils/responseFlatten'
import { Card, CardDeck } from 'react-bootstrap'

const SuccessfulBooking: React.FC = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const query = window.location.search
    const params = new URLSearchParams(query)
    const bookingId = params.get('bookingid')
    const [linkId, setLinkId] = useState<string | null>(null)
    const [packageDetails, setPackageDetails] = useState<any>()
    const [paymentDetails, setPaymentDetails] = useState<any>()

    const routeChange = () => {
        const path = `/add_client`
        history.push(path)
    }

    const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
    }

    // eslint-disable-next-line
    const { data: get_client_booking } = useQuery(GET_CLIENT_BOOKING, {
        variables: { id: bookingId },
        onCompleted: (response) => {
            const flattenBookingResponse = flattenObj(response.clientBooking)
            setPackageDetails(flattenBookingResponse)
        }
    })

    useEffect(() => {
        // Fetch data from cashfree's GET API using the link Id
        const fetchData = () => {
            if (packageDetails?.fitnesspackages[0].fitnesspackagepricing[0].mrp !== 'free') {
                axios
                    .get(
                        `${process.env.REACT_APP_URL}/api/client-booking/getpaymentlinksbylinkid/?link_id=link_id_${bookingId}`,
                        config
                    )
                    .then((response) => {
                        setPaymentDetails(response.data.cfLink)
                        setLinkId(response.data.cfLink.linkId)
                    })
            }
        }

        if (packageDetails?.fitnesspackages[0].fitnesspackagepricing[0].mrp !== 'free') {
            fetchData()
        }
    }, [])

    return (
        <div className="col-lg-12">
            <div className="d-flex justify-content-center">
                <img src="/images/transaction/success.png" alt="failed" />
            </div>
            <div className="d-flex justify-content-center align-item-center mt-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="50"
                    viewBox="0 0 120 120"
                >
                    <circle cx="60" cy="60" r="54" fill="#6BD17C" />
                    <path
                        d="M43.75 60.646L55.475 72.36 81.29 46.545"
                        stroke="#fff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <h1 className="text-success ml-2 ">Yay!! Booking Successful</h1>
            </div>

            <h4 className="text-center mt-4">
                Transaction of {paymentDetails?.linkCurrency} {paymentDetails?.linkAmountPaid} is
                successful for {linkId}
            </h4>
            {paymentDetails?.linkUrl ? (
                <h6 className="text-center mt-2">
                    <b>Link url:</b>{' '}
                    <a href={paymentDetails?.linkUrl} style={{ color: 'black' }}>
                        {paymentDetails?.linkUrl}
                    </a>
                </h6>
            ) : null}

            <div className="d-flex justify-content-center mt-4">
                <Button onClick={routeChange} variant="success">
                    Go back to client page
                </Button>
            </div>
            <CardDeck className="mt-3">
                <Card>
                    <Card.Header>
                        <h4 className="text-muted">Client&apos;s details</h4>
                    </Card.Header>

                    <Card.Body>
                        <Card.Text>
                            <b className="mr-2">Name </b>:{' '}
                            {paymentDetails?.customerDetails?.customerName
                                ? paymentDetails?.customerDetails?.customerName
                                : `${packageDetails?.ClientUser[0].First_Name} ${packageDetails?.ClientUser[0].Last_Name}`}
                            <br />
                            <b className="mr-2">Phone no.</b>:{' '}
                            {paymentDetails?.customerDetails?.customerPhone
                                ? paymentDetails?.customerDetails?.customerPhone
                                : packageDetails?.ClientUser[0].Phone_Number}
                            <br />
                            <b className="mr-2">Email</b>:{' '}
                            {paymentDetails?.customerDetails?.customerEmail
                                ? paymentDetails?.customerDetails?.customerEmail
                                : packageDetails?.ClientUser[0].email}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        <h4 className="text-muted">Offering details</h4>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <b className="mr-2">Name </b>:{' '}
                            {packageDetails?.fitnesspackages[0].packagename}
                            <br />
                            <b className="mr-2">Duration</b>: {packageDetails?.package_duration}{' '}
                            {packageDetails?.package_duration === 1 ? 'day' : 'days'}
                            <br />
                            <b className="mr-2">Type</b>:{' '}
                            {packageDetails?.fitnesspackages[0].fitness_package_type.type}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardDeck>
        </div>
    )
}

export default SuccessfulBooking
