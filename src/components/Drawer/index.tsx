import React from 'react'
import './style.css'
import { Row, Col, Card } from 'react-bootstrap'
import DisplayImage from '../DisplayImage'
import Icons from '../Icons'

interface Details {
    type: string
    name: string
    level: string
    thumbnailId: string
    // eslint-disable-next-line
    pricing?: any
    address: {
        address1: string
        city: string
        id: string
        state: string
        __typename: string
    }
    ptonline: string
    ptoffline: string
    grouponline: string
    groupoffline: string
    recordedclasses: string
}

const Drawer: React.FC<{
    show: boolean
    close: () => void
    details: Details
}> = (props) => {
    return (
        <>
            {props ? (
                <div
                    className={
                        props.show
                            ? 'side-drawer open col-lg-7 col-sm-8'
                            : 'side-drawer col-lg-7 col-sm-8'
                    }
                >
                    <Row>
                        <Col lg={1}>
                            <div onClick={props.close}>
                                <Icons name={'close'} style={{ cursor: 'pointer' }} />
                            </div>
                        </Col>

                        <Col lg={11}>
                            <div
                                style={{
                                    background: 'no-repeat url(assets/phonescreen.svg)',
                                    backgroundAttachment: 'scroll',
                                    backgroundSize: '100% 100%'
                                }}
                            >
                                <div style={{ height: '100vh', width: '40vh' }}>
                                    {props.details.type !== 'Cohort' &&
                                        props.details.type !== 'Classic Class'}
                                    <Card className="rounded ml-5 mt-5 d-flex preview__card">
                                        <Row>
                                            <Col lg={12}>
                                                <DisplayImage
                                                    imageName={
                                                        props.details.thumbnailId
                                                            ? props.details.thumbnailId
                                                            : ''
                                                    }
                                                    defaultImageUrl="assets/placeholder.svg"
                                                    imageCSS="rounded-lg w-100 img-fluid img-thumbnail"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={5} sm={5} className="ml-1">
                                                <p style={{ fontSize: '0.7rem' }}>
                                                    {props.details.name}
                                                </p>
                                                <p
                                                    style={{ fontSize: '0.7rem' }}
                                                    className="bg-secondary text-white rounded-pill text-center"
                                                >
                                                    {props.details.level}
                                                </p>
                                            </Col>
                                            <Col lg={5} sm={5} className="ml-1 d-flex">
                                                {props.details.address ? (
                                                    <>
                                                        <img
                                                            src="assets/location.svg"
                                                            alt="location"
                                                            style={{ height: '1.5rem' }}
                                                        />
                                                        <p style={{ fontSize: '0.7rem' }}>
                                                            {props.details.address.address1}
                                                        </p>
                                                    </>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        {props.details?.type === 'Classic Class' ? null : <hr />}
                                        <Row>
                                            <Col lg={6} sm={6} className="ml-1 d-flex">
                                                <Row>
                                                    <Col lg={12} sm={12}>
                                                        {props.details?.type === 'Group Class' ? (
                                                            <>
                                                                <img
                                                                    loading="lazy"
                                                                    src={'assets/Group-Offline.svg'}
                                                                    alt="group-offline"
                                                                    height={25}
                                                                />
                                                                +
                                                                <img
                                                                    loading="lazy"
                                                                    src="assets/Group-Online.svg"
                                                                    height={25}
                                                                    alt="group-online"
                                                                />{' '}
                                                            </>
                                                        ) : null}
                                                        {props.details?.type ===
                                                        'Custom Fitness' ? (
                                                            <>
                                                                <img
                                                                    loading="lazy"
                                                                    src="assets/personal-training-online.svg"
                                                                    height={20}
                                                                    alt="ptonline"
                                                                />
                                                                <img
                                                                    loading="lazy"
                                                                    src={'assets/Group-Offline.svg'}
                                                                    alt="group-offline"
                                                                    height={20}
                                                                />
                                                                <img
                                                                    loading="lazy"
                                                                    src="assets/Group-Online.svg"
                                                                    height={20}
                                                                    alt="group-online"
                                                                />
                                                                <img
                                                                    loading="lazy"
                                                                    src="assets/offeringImages/classic-class-online.svg"
                                                                    height={20}
                                                                    alt="recorded"
                                                                />
                                                            </>
                                                        ) : null}
                                                        {props.details?.type === 'One-On-One' ||
                                                        props.details?.type === 'On-Demand PT' ? (
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
                                                        {props.details?.type === 'Cohort' ||
                                                        props.details?.type === 'Event' ? (
                                                            <>
                                                                <img
                                                                    loading="lazy"
                                                                    src={'assets/home.svg'}
                                                                    alt="home"
                                                                    height={20}
                                                                    style={{ paddingRight: '2px' }}
                                                                />

                                                                <img
                                                                    loading="lazy"
                                                                    src="assets/food.svg"
                                                                    height={20}
                                                                    alt="ptonline"
                                                                    style={{ paddingLeft: '2px' }}
                                                                />
                                                            </>
                                                        ) : null}
                                                        <br />
                                                        {props.details?.type === 'One-On-One' ||
                                                        props.details?.type === 'On-Demand PT' ? (
                                                            <div
                                                                className="d-flex "
                                                                style={{ fontSize: '0.7rem' }}
                                                            >
                                                                <div className="px-2">
                                                                    {props.details?.ptoffline
                                                                        ? props.details?.ptoffline
                                                                        : 0}
                                                                </div>
                                                                <div className="px-3">
                                                                    {props.details?.ptonline
                                                                        ? props.details?.ptonline
                                                                        : 0}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        {props.details?.type === 'Group Class' ? (
                                                            <div
                                                                className="d-flex "
                                                                style={{ fontSize: '0.7rem' }}
                                                            >
                                                                <div className="px-2">
                                                                    {props.details.groupoffline
                                                                        ? props.details.groupoffline
                                                                        : 0}
                                                                </div>
                                                                <div className="px-3">
                                                                    {props.details.grouponline
                                                                        ? props.details.grouponline
                                                                        : 0}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col lg={4} className="ml-1">
                                                {props.details &&
                                                props.details?.pricing &&
                                                props.details?.pricing.length &&
                                                props.details?.pricing[0].mrp === 'free' ? (
                                                    <p style={{ fontSize: '0.7rem' }}>Free</p>
                                                ) : (
                                                    <p style={{ fontSize: '0.7rem' }}>
                                                        Rs.{' '}
                                                        {(props.details?.type === 'On-Demand PT' ||
                                                            props.details?.type ===
                                                                'Classic Class' ||
                                                            props.details?.type === 'Cohort') &&
                                                        props.details?.pricing &&
                                                        props.details?.pricing.length
                                                            ? props.details?.pricing?.find(
                                                                  (curr) => curr.duration === 1
                                                              ).mrp
                                                            : null}
                                                        {props.details?.type === 'Event' &&
                                                        props.details?.pricing &&
                                                        props.details?.pricing.length
                                                            ? props.details.pricing.find(
                                                                  (curr) => curr.duration === 0
                                                              ).mrp
                                                            : null}
                                                        {(props.details?.type === 'One-On-One' ||
                                                            props.details?.type ===
                                                                'Custom Fitness' ||
                                                            props.details?.type === 'Group Class' ||
                                                            props.details?.type ===
                                                                'Live Stream Channel') &&
                                                        props.details?.pricing &&
                                                        props.details?.pricing.length
                                                            ? `${
                                                                  props.details.pricing.find(
                                                                      (curr) => curr.duration === 30
                                                                  ).mrp
                                                              } Monthly`
                                                            : null}
                                                    </p>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            ) : null}
        </>
    )
}

export default Drawer
