import React, { Fragment } from 'react'
import { Col, Row } from 'react-bootstrap'

export default function CustomPreview(props) {
    const {packageType, ptonline, ptoffline, grouponline, groupoffline, recordedclasses} = props
    return (
        <Row>
        <Col>
            {ptonline !== undefined && ptonline !== 0 ?
                <Fragment>
                    <img src={`/assets/${packageType}personal-training-online.svg`} alt={`${packageType}`} title={`${packageType} personal training online`} />
                    <p className='text-nowrap'>{ptonline} Online</p>
                </Fragment> : ""
            }
        </Col>
        <Col>
            {ptoffline !== undefined && ptoffline !== 0 ?
                <Fragment>
                    <img src={`/assets/${packageType}personal-training-offline.svg`} alt={`${packageType}`} title={`${packageType} personal training offline`} />
                    <p className='text-nowrap'>{ptoffline} Offline</p>
                </Fragment> : ""
            }
        </Col>
        <Col>
            {grouponline !== undefined && grouponline !== 0 ?
                <Fragment>
                    <img src={`/assets/${packageType}group-online.svg`} alt={`${packageType}`} title={`${packageType} group online`} />
                    <p className='text-nowrap'>{grouponline} Group</p>
                </Fragment> : ""
            }
        </Col>
        <Col>
            {groupoffline !== undefined && groupoffline !== 0 ?
                <Fragment>
                    <img src={`/assets/${packageType}group-offline.svg`} alt={`${packageType}`} title={`${packageType} group offline`} />
                    <p className='text-nowrap'>{groupoffline} Group</p>
                </Fragment> : ""
            }
        </Col>
        <Col>
            {recordedclasses !== undefined && recordedclasses !== 0 ?
                <Fragment>
                    <img src={`/assets/${packageType}classic.svg`} alt={`${packageType}`} title={packageType} />
                    <p className='text-nowrap'>{recordedclasses} Recorded</p>
                </Fragment> : ""
            }
        </Col>

    </Row>
    )
}
