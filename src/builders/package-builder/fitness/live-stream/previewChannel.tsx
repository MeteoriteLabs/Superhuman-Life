import React from 'react';
import {Carousel, Card} from 'react-bootstrap';
import SocialMediaComponent from '../../../../components/customWidgets/SocialMediaComponent';
import DisplayImage from '../../../../components/DisplayImage/index';

const PreviewChannel = (props) => {

    const formData = props?.formContext;
    var pricing;
    if(typeof(formData.pricing) === 'string'){
        pricing = formData?.pricing === "free" ? "free" : JSON.parse(formData?.pricing).filter((item) => item.mrp !== null);
    }else {
        pricing = [...props?.formContext?.pricing];
    }

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    function handleCardRender(){
        if(pricing === 'free'){
            return (
                <Carousel.Item key={1}>
                        <Card className="text-center mx-auto" style={{ borderRadius: '20px', width: '80%'}}>
                        <Card.Body className='pr-0 py-0'>
                            <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                                <DisplayImage imageName={props?.formContext?.thumbnail ? props?.formContext?.thumbnail : null} defaultImageUrl="https://picsum.photos/200" imageCSS="rounded-lg w-25 m-2"/>
                                {/* <div className='pt-3'>
                                    <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random" />
                                </div> */}
                                <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                                    <Card.Title>{props.formContext.channelName}</Card.Title>
                                    <p>{props.formContext.About}</p>
                                    <div>
                                        <div className='d-flex justify-content-start align-items-center'>
                                            {JSON.parse(formData.discpline).map((item, index) => {
                                                return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                    <p className='mb-0'>{item.disciplinename}</p>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className={`py-2 px-4 text-white`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', backgroundColor: "#04BEBD" }}>{ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]}</p>
                                </div>
                            </div>
                            <div className='pt-3 d-flex justify-content-between align-items-center '>
                                <div className='d-flex justify-content-center align-items-center'>
                                <div>
                                    <img src={`/assets/customclassic.svg`} alt="custom-classic" title="Personal Training Online" />
                                    <p>{5}</p>
                                </div>
                                    <div className='px-4' style={{ borderRight: '1px solid black' }}></div>
                                </div>
                                <div>
                                    <p className='mb-0 mr-3' style={{ color: '#72B54C', fontSize: '2rem' }}>free</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    </Carousel.Item>
            )
        }else {
            return (
                pricing.map((item, index) => {
                    return (
                        console.log(item),
                        <Carousel.Item key={index}>
                            <Card className="text-center mx-auto" style={{ borderRadius: '20px', width: '80%'}}>
                            <Card.Body className='pr-0 py-0'>
                                <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                                    <DisplayImage imageName={props?.formContext?.thumbnail ? props?.formContext?.thumbnail : null} defaultImageUrl="https://picsum.photos/200" imageCSS="rounded-lg w-25 m-2"/>
                                    {/* <div className='pt-3'>
                                        <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random" />
                                    </div> */}
                                    <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                                        <Card.Title>{props.formContext.channelName}</Card.Title>
                                        <p>{props.formContext.About}</p>
                                        <div>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                {JSON.parse(formData.discpline).map((item, index) => {
                                                    return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                        <p className='mb-0'>{item.disciplinename}</p>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`py-2 px-4 text-white`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', backgroundColor: "#04BEBD" }}>{ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]}</p>
                                    </div>
                                </div>
                                <div className='pt-3 d-flex justify-content-between align-items-center '>
                                    <div className='d-flex justify-content-center align-items-center'>
                                    <div>
                                        <img src={`/assets/livestream_online.svg`} alt="custom-classic" title="Personal Training Online" />
                                        <p>{item.duration}</p>
                                    </div>
                                        <div className='px-4' style={{ borderRight: '1px solid black' }}></div>
                                    </div>
                                    <div>
                                        <p className='mb-0 mr-3' style={{ color: '#72B54C', fontSize: '2rem' }}>{"\u20B9"} {item.mrp}</p>
                                        <p>per {item.duration} days</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        </Carousel.Item>
                    )
                })
            )
        }
    }

    return (
        <>
        <Carousel>
            {handleCardRender()}
        </Carousel>

            <SocialMediaComponent url={URL} />
        </>
    );
};

export default PreviewChannel;