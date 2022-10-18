import React from 'react';
import { Link } from 'react-router-dom';
import { Card, ProgressBar } from 'react-bootstrap';
import './AddPayee.css';

function AddPayee() {
    return (
        <>
            <div>
                <Card className="p-3">
                    <div className='d-flex justify-content-between flex-wrap'>
                        <div>
                            <p>Nikita Kumawat</p>
                            <p>9876543210</p>
                            <p>nikitakumawat44@gmail</p>
                        </div>
                        <div>
                            <p><img src="assets/pause.svg" alt="pause" /> Pause Payment</p>
                            <p><img src="assets/stop.svg" alt="stop" /> Stop Payment</p>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between flex-wrap mt-2'>
                        <div>
                            <p><b>Type of Payee</b> : Individual</p>
                            <p><b>Frequency</b> : Monthly</p>
                            <p><b>Type of Payment</b> : Supplies</p>
                        </div>
                        <div>
                            <p><b>Start Date</b> : 30th June 2022</p>
                            <p><b>Payment Cycle</b> : 30th of each month</p>
                            <p><b>Next Payment</b> : 30th july 2022</p>
                        </div>
                    </div>
                    <hr />
                    <div className='flex'>
                        <p className='float-left'><b>Net Amount</b></p>
                        <p className='float-right'><b>Rs. 30000</b></p>
                    </div>
                </Card>

                <div className='d-lg-flex flex-lg-row d-md-flex flex-md-row p-2 flex-sm-row justify-content-around'>
                    <Card as={Link} to={'payee_details'} className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' style={{cursor: 'pointer', width: '20vw'}}>
                        <Card.Body>
                            <img src="assets/payeeDetails.svg" alt="payee" />
                            <p className='text-dark'><b>Payee details</b></p>
                            <ProgressBar variant="success" now={40} />
                        </Card.Body>
                    </Card>

                    <Card className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' style={{cursor: 'pointer', width: '20vw'}}>
                        <Card.Body>
                            <img src="assets/setting.svg" alt="setting" />
                            <p className='text-dark'><b>Payment Settings</b></p>
                            <ProgressBar variant="success" now={40} />
                        </Card.Body>
                    </Card>

                    <Card as={Link} to={'payee_payment_mode'} className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' style={{cursor: 'pointer', width: '20vw'}}>
                        <Card.Body>
                            <img src="assets/payment-mode.svg" alt="payementmode" />
                            <p className='text-dark'><b>Payee payment mode</b></p>
                            <ProgressBar variant="success" now={40} />
                        </Card.Body>
                    </Card>

                </div>

            </div>
        </>
    )
}

export default AddPayee;
