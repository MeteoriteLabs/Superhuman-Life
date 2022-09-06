import React from 'react'
import { Button } from 'react-bootstrap'

export default function SocialMediaComponent({ url }) {
    return (
        <div className='text-center font-weight-bold mt-5'>
            <a className="text-dark" href={url}>{url}</a>
            <div>
                <Button className='py-2 my-2 customButton'>Copy link</Button>
                {/* <p className='d-block mx-auto' style={{ fontSize: '1.2rem' }}><a href="#1" className='text-dark'>Share the package</a></p> */}
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
    )
}
