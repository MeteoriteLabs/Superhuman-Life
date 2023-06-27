import React, { Fragment } from 'react'
import { Col, Row } from 'react-bootstrap'

const CustomPreview: React.FC<{
    packageType
    ptonline: any
    ptoffline: any
    grouponline: any
    groupoffline: any
    recordedclasses: any
}> = (props) => {
    return (
        <Row>
            <Col>
                {props.ptonline !== undefined && props.ptonline !== 0 && (
                    <Fragment>
                        <img
                            src={`/assets/preview-${props.packageType}-personal-training-online.svg`}
                            alt={`${props.packageType}`}
                            title={`${props.packageType} personal training online`}
                        />
                        <p className="text-nowrap">{props.ptonline}</p>
                    </Fragment>
                )}
            </Col>
            <Col>
                {props.ptoffline !== undefined && props.ptoffline !== 0 && (
                    <Fragment>
                        <img
                            src={`/assets/preview-${props.packageType}-personal-training-offline.svg`}
                            alt={`${props.packageType}`}
                            title={`${props.packageType} personal training offline`}
                        />
                        <p className="text-nowrap">{props.ptoffline}</p>
                    </Fragment>
                )}
            </Col>
            <Col>
                {props.grouponline !== undefined && props.grouponline !== 0 && (
                    <Fragment>
                        <img
                            src={`/assets/preview-${props.packageType}-group-online.svg`}
                            alt={`${props.packageType}`}
                            title={`${props.packageType} group online`}
                        />
                        <p className="text-nowrap">{props.grouponline}</p>
                    </Fragment>
                )}
            </Col>
            <Col>
                {props.groupoffline !== undefined && props.groupoffline !== 0 && (
                    <Fragment>
                        <img
                            src={`/assets/preview-${props.packageType}-group-offline.svg`}
                            alt={`${props.packageType}`}
                            title={`${props.packageType} group offline`}
                        />
                        <p className="text-nowrap">{props.groupoffline}</p>
                    </Fragment>
                )}
            </Col>

            {/* preview-custom-classic */}
            <Col>
                {props.recordedclasses && props.recordedclasses.length && (
                    <Fragment>
                        <img
                            src={`/assets/preview-${props.packageType}-classic.svg`}
                            alt={`${props.packageType}`}
                            title={props.packageType}
                        />
                        <p className="text-nowrap">{props.recordedclasses}</p>
                    </Fragment>
                )}
            </Col>
        </Row>
    )
}

export default CustomPreview
