import React from 'react';
import {Carousel, Card} from 'react-bootstrap';
import SocialMediaComponent from '../../widgetCustom/Preview/SocialMediaComponent';
import DisplayImage from '../../../../../components/DisplayImage/index';

const PreviewPt = (props) => {

    console.log(props.formContext)

    const formData = props?.formContext;
    const programDetails = JSON.parse(formData?.programDetails);
    var pricing;
    if(typeof(formData.pricingDetail) === 'string'){
        pricing = formData?.pricingDetail === "free" ? "free" : JSON.parse(formData?.pricingDetail).filter((item) => item.mrp !== null);
    }else {
        pricing = [...props?.formContext?.pricingDetail];
    }

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    enum ENUM_FITNESSPACKAGE_PTCLASSSIZE {
        Solo,
        Couple,
        Family
    }

    function handleImageRender(mode: string){
        if(mode === "0"){
            return <div><img src={`/assets/PTonline.svg`} alt="personal-training" title="Personal Training Online" /><p>{programDetails.online}</p></div>
        }else if(mode === "1"){
            return <div><img src={`/assets/PToffline.svg`} alt="personal-training" title="Personal Training Online" /><p>{programDetails.offline}</p></div>
        }else {
            return <><div>
                <img src={`/assets/PTonline.svg`} alt="personal-training" title="Personal Training Online" />
                <p>{programDetails.online}</p>
            </div><div>
                <img src={`/assets/PToffline.svg`} alt="personal-training" title="Personal Training Offline" />
                <p>{programDetails.offline}</p>
            </div></>
        }
    }

    function handleCardRender(){
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
                                        <Card.Title>{props.formContext.packagename}</Card.Title>
                                        <p>{props.formContext.About}</p>
                                        <div>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                {/* {props?.formContext?.map((item, index) => {
                                                    return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                        <p className='mb-0'>{item.disciplinename}</p>
                                                    </div>
                                                })} */}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`py-2 px-4 text-white`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', backgroundColor: "#04BEBD" }}>{ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]}</p>
                                    </div>
                                </div>
                                <div className='pt-3 d-flex justify-content-between align-items-center '>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        {handleImageRender(programDetails.mode)}
                                        {/* <div className='px-4' style={{ borderRight: '1px solid black' }}></div> */}
                                        <div className='ml-4'>
                                            <h4>Class Size</h4>
                                            <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{ENUM_FITNESSPACKAGE_PTCLASSSIZE[props.formContext.classSize]}</p>
                                        </div>
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

    return (
        <>
        <Carousel>
            {handleCardRender()}
        </Carousel>

            <SocialMediaComponent url={URL} />
        </>
    );
};

export default PreviewPt;