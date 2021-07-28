import React, { useEffect, useState } from 'react'
import { Carousel, Card, Button, Row, Col } from 'react-bootstrap';
import './fitnessPreview.css'
import * as _ from 'lodash'



export default function ModalPreview(props) {
    let { userData, fitnesspackagepricing, packageType, type, actionType } = props;

    let { disciplines, ptclasssize, ptonline, ptoffline, URL, level, grouponline, groupoffline, recordedclasses, duration, classsize } = userData;

    const [onlineClassesType, setOnlineClassesType] = useState<string>()
    const [offlineClassesType, setOffineClassesType] = useState<string>();
    const [updatePricing, setUpdatePricing] = useState(fitnesspackagepricing)
    const [sizeType, setSizeType] = useState<string | number>()
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    // console.log('action type', actionType)
    console.log(packageType)
    // console.log(duration)
    // console.log('fitnesspackagepricing', fitnesspackagepricing)





    if (typeof disciplines !== "object") disciplines = JSON.parse(disciplines);
    let beginnerTag = '';
    let intermediateTag = '';
    let advancedTag = '';

    if (level === "Beginner") {
        beginnerTag = 'beginnerTag'
    } else if (level === "Intermediate") {
        intermediateTag = "intermediateTag"
    } else if (level === "Advance") {
        advancedTag = 'advancedTag'
    }


    useEffect(() => {
        if (packageType === "personal-training") {
            setOnlineClassesType(ptonline);
            setOffineClassesType(ptoffline);
            setSizeType(ptclasssize)
        } else if (packageType === "group") {
            setOnlineClassesType(grouponline);
            setOffineClassesType(groupoffline);
            setSizeType(classsize)
        }
        else if (packageType === "classic") {
            let updatePricing = _.cloneDeep(fitnesspackagepricing);
            updatePricing = updatePricing.splice(0, 1)
            updatePricing[0].duration = duration;
            setUpdatePricing(updatePricing)
        }
    }, [packageType, actionType])


    return <div>
        <Carousel slide={true} touch={true} activeIndex={index} onSelect={handleSelect}>
            {updatePricing.map((price, idx) => {
                return <Carousel.Item key={idx}>
                    <Card className="text-center w-75 mx-auto" style={{ borderRadius: '20px' }}>
                        <Card.Body className='pr-0 py-0'>
                            <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                                <div className='pt-3'>
                                    <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random" />
                                </div>
                                <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                                    <Card.Title>{type} program</Card.Title>
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero non numquam, quos ut placeat quo ducimus facere inventore facilis nostrum dolor amet doloremque molestias quasi ab consectetur, commodi maiores? Doloribus.</p>
                                    <Card.Text>
                                        <div className='d-flex justify-content-start align-items-center'>
                                            {disciplines?.map((item, index) => {
                                                return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                    <p className='mb-0'>{item.disciplinename}</p>
                                                </div>
                                            })}
                                        </div>
                                    </Card.Text>
                                </div>
                                <div>
                                    <p className={`py-2 px-4 text-white ${beginnerTag} ${intermediateTag} ${advancedTag}`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px' }}>{level}</p>
                                </div>
                            </div>
                            <Card.Text className='pt-3 d-flex justify-content-between align-items-center '>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {packageType !== "custom" ?
                                        packageType !== "classic" ? <>
                                            <div>
                                                <img src={`/assets/${packageType}-Offline.svg`} alt='123' />
                                                <p>{offlineClassesType} Offline</p>
                                            </div>
                                            <div className='px-4' style={{ borderRight: '1px solid black' }}>
                                                <img src={`/assets/${packageType}-Online.svg`} alt='123' />
                                                <p>{onlineClassesType} Online</p>
                                            </div>
                                        </> :
                                            <div className='px-4' style={{ borderRight: '1px solid black' }}>
                                                <img src={`/assets/${packageType}.svg`} alt='123' />
                                                <p>{recordedclasses}</p>
                                            </div>
                                        :

                                        <Row>
                                            <Col>
                                                {ptonline !== undefined && ptonline !== 0 ?
                                                    <>
                                                        <img src={`/assets/${packageType}personal-training-online.svg`} alt='123' />
                                                        <p className='text-nowrap'>{ptonline} Online</p>
                                                    </> : ""
                                                }
                                            </Col>
                                            <Col>
                                                {ptoffline !== undefined && ptoffline !== 0 ?
                                                    <>
                                                        <img src={`/assets/${packageType}personal-training-offline.svg`} alt='123' />
                                                        <p className='text-nowrap'>{ptoffline} Offline</p>
                                                    </> : ""
                                                }
                                            </Col>
                                            <Col>
                                                {grouponline !== undefined && grouponline !== 0 ?
                                                    <>
                                                        <img src={`/assets/${packageType}personal-training-online.svg`} alt='123' />
                                                        <p className='text-nowrap'>{grouponline} Group</p>
                                                    </> : ""
                                                }
                                            </Col>
                                            <Col>
                                                {groupoffline !== undefined && groupoffline !== 0 ?
                                                    <>
                                                        <img src={`/assets/${packageType}personal-training-online.svg`} alt='123' />
                                                        <p className='text-nowrap'>{groupoffline} Group</p>
                                                    </> : ""
                                                }
                                            </Col>
                                            <Col>
                                                {recordedclasses !== undefined && recordedclasses !== 0 ?
                                                    <>
                                                        <img src={`/assets/${packageType}personal-training-online.svg`} alt='123' />
                                                        <p className='text-nowrap'>{recordedclasses} Recorded</p>
                                                    </> : ""
                                                }
                                            </Col>

                                        </Row>

                                    }


                                    {(packageType !== "classic" && packageType !== 'custom') ? <div className='ml-4'>
                                        <h4>Class Size</h4>
                                        <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{sizeType}</p>
                                    </div> : ""}
                                </div>
                                <div>
                                    <p className='mb-0 mr-3' style={{ color: '#72B54C', fontSize: '2rem' }}>{"\u20B9"} {price.mrp}</p>
                                    <p>per {price.duration} days</p>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
            })}
        </Carousel>
        <div className='text-center font-weight-bold mt-5'>
            <a className="text-dark" href={URL}>{URL}</a>
            <div>
                <Button className='py-2 my-2 customButton'>Copy link</Button>
                <p className='d-block mx-auto' style={{ fontSize: '1.2rem' }}><a href="#1" className='text-dark'>Share the package</a></p>
            </div>
            <div className='mt-5'>
                <span className='mr-4'>
                    <a href="31212"><img src={process.env.PUBLIC_URL + '/assets/instagram.svg'} alt="instagram" /></a>
                </span>
                <span className='mr-4'>
                    <a href="31212"><img src={process.env.PUBLIC_URL + '/assets/facebook.svg'} alt="facebook" /></a>
                </span>
                <span className='mr-4'>
                    <a href="31212"><img src={process.env.PUBLIC_URL + '/assets/whatsapp.svg'} alt="whatsapp" /></a>
                </span>
                <span>
                    <a href="31212"><img src={process.env.PUBLIC_URL + '/assets/telegram.svg'} alt="telegram" /></a>
                </span>
            </div>


        </div>
    </div>
}
