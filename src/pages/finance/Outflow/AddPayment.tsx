import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import PayeeDetails from './PayeeDetails/PayeeDetails';
import PaymentSettings from './PaymentSettings/PaymentSettings';
import PayeePaymentMode from './PayeePaymentMode/PayeePaymentMode';

function AddPayment() {
    const [showPayeeDetails, setShowPayeeDetails] = useState(false);
    const [showPaymentSetting, setShowPaymentSetting] = useState(false);
    const [showPayeePaymentMode, setShowPayeePaymentMode] = useState(false);

    const handleClosePayeeDetails = () => setShowPayeeDetails(false);
    const handleShowPayeeDetails = () => setShowPayeeDetails(true);

    const handleClosePaymentSetting = () => setShowPaymentSetting(false);
    const handleShowPaymentSetting = () => setShowPaymentSetting(true);

    const handleClosePayeePaymentMode = () => setShowPayeePaymentMode(false);
    const handleShowPayeePaymentMode = () => setShowPayeePaymentMode(true);

    return (
        <>
            {showPayeeDetails && <PayeeDetails show={showPayeeDetails} onHide={handleClosePayeeDetails} />}
            {showPaymentSetting && <PaymentSettings show={showPaymentSetting} onHide={handleClosePaymentSetting} />}
            {showPayeePaymentMode && <PayeePaymentMode show={showPayeePaymentMode} onHide={handleClosePayeePaymentMode} />}
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

                <div className='d-lg-flex flex-lg-row d-md-flex flex-md-row p-2 flex-sm-row justify-content-around' onClick={handleShowPayeeDetails} >
                    <Card className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <img src="assets/payeeDetails.svg" alt="payee" />
                            <p><b>Payee details</b></p>
                        </Card.Body>
                    </Card>

                    <Card className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' onClick={handleShowPaymentSetting} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <img src="assets/setting.svg" alt="setting" />
                            <p><b>Payment Settings</b></p>
                            
                        </Card.Body>
                    </Card>

                    <Card className='m-2 text-center p-5 shadow-lg p-3 mb-5 bg-white rounded' onClick={handleShowPayeePaymentMode} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <img src="assets/payment-mode.svg" alt="payementmode" />
                            <p><b>Payee payment mode</b></p>
                            
                        </Card.Body>
                    </Card>

                </div>

            </div>
        </>
    )
}

export default AddPayment;
