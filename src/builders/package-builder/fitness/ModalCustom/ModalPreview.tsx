import React, { useState } from 'react'
import { Carousel, Card, Button } from 'react-bootstrap';

export default function ModalPreview(props) {
    console.log(props)
    
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    let { userData, arrPrice } = props;
    let { name, discipline, about, size, number_classes_online, number_classes_offline, URL } = userData;
    if (typeof discipline !== "object")  discipline = JSON.parse(discipline);
  
    return <div>
        <Carousel slide={true} touch={true} activeIndex={index} onSelect={handleSelect}>
            {arrPrice.map((price, idx) => {
                return <Carousel.Item key={idx}>
                    <Card className="text-center w-75 mx-auto">
                        <Card.Body>
                            <Card.Title>Personal Package Name: {name}</Card.Title>
                            <Card.Text>
                                <p>{about}</p>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {discipline.map((item, index) => {
                                        return <div key={index} className='mx-2 mt-3 text-white font-weight-bold' style={{ padding: '0.5rem 2rem', backgroundColor: '#647A8C', borderRadius: '20px' }}>{item.label}</div>
                                    })}
                                </div>
                            </Card.Text>
                            <Card.Text>
                                <div className='d-flex  justify-content-between align-items-center'>
                                    <p>{size}</p>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <div>
                                            <img src="/assets/PT-Online.svg" alt='123' />
                                            <p>{number_classes_online}</p>
                                        </div>
                                        <div>
                                            <img src="/assets/PT-Offline.svg" alt='123' />
                                            <p>{number_classes_offline}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Rs: {price.mrp}</p>
                                        <p>{price.duration} days</p>
                                    </div>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
            })}
        </Carousel>
        <div className='text-center font-weight-bold'>

            <a className="text-dark" href={URL}>{URL}</a>
            <div>
                <Button>Copy link</Button>
                <Button className='d-block mx-auto'>Settings</Button>
                <Button className='d-block mx-auto'>Share the package</Button>
            </div>
            <div>
                <div>
                    <a href="31212"><i className="fab fa-facebook-square" /></a>
                    <a href="31212"><i className="fab fa-facebook-square" /></a>
                    <a href="31212"><i className="fab fa-facebook-square" /></a>
                    <a href="31212"><i className="fab fa-facebook-square" /></a>
                </div>

            </div>
        </div>
    </div>
}
