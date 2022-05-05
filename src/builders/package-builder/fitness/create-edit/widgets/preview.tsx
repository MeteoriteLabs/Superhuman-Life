import React from 'react';
import {Row, Col, Carousel, Card} from 'react-bootstrap';
import SocialMediaComponent from '../../widgetCustom/Preview/SocialMediaComponent';

const PreviewChannel = (props) => {

    console.log(props);

    return (
        <>
        <Carousel>
            <Carousel.Item key={1}>
                        <Card className="text-center mx-auto" style={{ borderRadius: '20px', width: '80%'}}>
                            <Card.Body className='pr-0 py-0'>
                                <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                                    <div className='pt-3'>
                                        <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random" />
                                    </div>
                                    <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                                        <Card.Title>Channel Name</Card.Title>
                                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero non numquam, quos ut placeat quo ducimus facere inventore facilis nostrum dolor amet doloremque molestias quasi ab consectetur, commodi maiores? Doloribus.</p>
                                        <div>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                {/* {disciplines?.map((item, index) => {
                                                    return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                        <p className='mb-0'>{item.disciplinename}</p>
                                                    </div>
                                                })} */}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`py-2 px-4 text-white`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px' }}>{"level"}</p>
                                    </div>
                                </div>
                                <div className='pt-3 d-flex justify-content-between align-items-center '>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        {/* {packageType !== "custom" ?
                                            packageType !== "classic" ?
                                                <PTGroupPreview
                                                    packageType={packageType}
                                                    offlineClassesType={offlineClassesType}
                                                    onlineClassesType={onlineClassesType}
                                                /> :
                                                <RecordedPreview
                                                    packageType={packageType}
                                                    recordedclasses={recordedclasses}
                                                />
                                            :
                                            <CustomPreview
                                                packageType={packageType}
                                                ptonline={ptonline}
                                                ptoffline={ptoffline}
                                                grouponline={grouponline}
                                                groupoffline={groupoffline}
                                                recordedclasses={recordedclasses}
                                            />
                                        } */}
                                        {/* {(packageType !== "classic" && packageType !== 'custom') && 
                                        <div className='ml-4'>
                                            <h4>Class Size</h4>
                                            <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{sizeType}</p>
                                        </div>} */}
                                    </div>
                                    <div>
                                        <p className='mb-0 mr-3' style={{ color: '#72B54C', fontSize: '2rem' }}>{"\u20B9"} {2000}</p>
                                        <p>per {30} days</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
            </Carousel>

            <SocialMediaComponent url={URL} />
        </>
    );
};

export default PreviewChannel;