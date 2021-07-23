import React, { useState } from 'react'
import { Carousel, Card, Button } from 'react-bootstrap';
import './fitnessPreview.css'



export default function ModalPreview(props) {

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    
    let { userData,fitnesspackagepricing } = props;
    let { disciplines,size, number_classes_online, number_classes_offline, URL, level } = userData;
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

    return <div>
        <Carousel slide={true} touch={true} activeIndex={index} onSelect={handleSelect}>
            {fitnesspackagepricing.map((price, idx) => {
                return <Carousel.Item key={idx}>
                    <Card className="text-center w-75 mx-auto" style={{ borderRadius: '20px' }}>
                        <Card.Body className='pr-0 py-0'>
                            <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                                <div className='pt-3'>
                                    <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random"/>
                                </div>
                                <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                                    <Card.Title>PT Program</Card.Title>
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero non numquam, quos ut placeat quo ducimus facere inventore facilis nostrum dolor amet doloremque molestias quasi ab consectetur, commodi maiores? Doloribus.</p>
                                    <Card.Text>
                                        <div className='d-flex justify-content-start align-items-center'>
                                            {disciplines.map((item, index) => {
                                                return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                                    <p className='mb-0'>{item.label}</p>
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
                                    <div>
                                        <img src="/assets/personal-training-Offline.svg" alt='123' />
                                        <p>{number_classes_offline} Offline</p>
                                    </div>
                                    <div className='px-4' style={{ borderRight: '1px solid black' }}>
                                        <img src="/assets/personal-training-Online.svg" alt='123' />
                                        <p>{number_classes_online} Online</p>
                                    </div>
                                    <div className='ml-4'>
                                        <h4>Class Size</h4>
                                        <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{size}</p>
                                    </div>
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
                    <a href="31212"><img src={process.env.PUBLIC_URL + '/assets/facebook.svg'} alt="facebook"/></a>
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
